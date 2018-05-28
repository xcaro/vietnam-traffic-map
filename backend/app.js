const express = require('express')
const app = express()
var multer = require('multer')
const r = require('rethinkdb')
const helper = require('./helper')
const path = require('path')
const servicesAccount = require('./firebase_adminsdk_key.json')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(servicesAccount),
  databaseURL: 'https://vietnam-traffic-map.firebaseio.com'
})

const NEAR_DIAMETER = 1000
const LINK_DIAMETER = 4000
let reportTrafficrentIdToken = null

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    var filetypes = /jpeg|jpg/
    var mimetype = filetypes.test(file.mimetype)
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }

    const err = 'Error: File upload only supports the following filetypes -  + filetypes'
    cb(err)
  }
})

const {
  checkSchema,
  validationResult
} = require('express-validator/check')
let connection = null

function createApp (dbName, isOnTest) {
  r.connect({ host: '192.168.1.2', port: 28015 }, function (err, conn) {
    if (err) throw err

    connection = conn
    helper.createDatabase(connection, dbName)
    connection.use(dbName)

    helper.createtableIfNotExist(connection, 'reportTrafficList')
    helper.createtableIfNotExist(connection, 'reportTrafficLinks')
    helper.createtableIfNotExist(connection, 'trafficAdministrators')
  })

  /**
   * Body parse Json
   */
  app.use(express.json())

  /**
   * Upvote
   */
  app.get('/traffic_report/up_vote/:id', (req, res) => {

  })

  /**
   * Downvote
   */
  app.get('traffic_report/down_vote/:id', (req, res) => {

  })

  /**
   * Downvote
   */

  /**
   * Create traffic report
   */
  app.post('/trafficReport',
    checkSchema({
      idToken: {
        in: ['body'],
        exists: {
          errorMessage: 'idToken không tồn tại'
        },

        custom: {
          options: (idToken) => {
            /**
             * Validate using firebase if not is on test mode
             * isOnTest false admin.verify
             */
            if (isOnTest === false) {
              admin.auth().verifyIdToken(idToken)
                .then(function (decodedToken) {
                  reportTrafficrentIdToken = decodedToken.uid
                  return Promise.resolve()
                }).catch(() => {
                  throw Error('idToken không hợp lệ')
                })
            } else if (isOnTest === true) {
              /**
              * Lorem is special for testing purpose
              */
              reportTrafficrentIdToken = idToken
              return Promise.resolve()
            } else {
              throw Error('idToken không hợp lệ')
            }
          }
        }
      },

      location: {
        in: ['body'],
        exists: {
          errorMessage: 'reportTrafficType không tồn tại'
        },

        custom: {
          options: (value) => {
            if (!('lat' in value && 'lng' in value)) {
              throw new Error(`location's scheme sai`)
            }

            return Promise.resolve()
          }
        }
      },

      reportTrafficType: {
        in: ['body'],
        isString: {
          errorMessage: 'reportTrafficType is wrong'
        },

        exists: {
          errorMessage: 'reportTrafficType must be exist'
        }
      },

      description: {
        in: ['body'],
        optional: true,
        isString: {
          errorMessage: 'Descripton is wrong'
        }
      }
    }), upload.array('images'), (req, res) => {
      /**
       * Express validator error
       */
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      /**
       * Check if location is close
       * Then upvote it
       */
      r.table('reportTrafficList')
        .filter({
          'status': 1,
          'reportTrafficType': req.body.reportTrafficType
        })
        .run(connection)
        .then((reportTrafficsor) => {
          return new Promise((resolve, reject) => {
            reportTrafficsor.each((err, reportTraffic) => {
              if (err) {
                reject(err)
                return false // stop each
              }

              /**
               * Check if location is too close
               */
              const reportTrafficLocation = reportTraffic.location
              const distance = helper.getDistance(reportTrafficLocation, req.body.location)
              if (distance <= NEAR_DIAMETER) { /** Location is too near */
                // Check if it has been upvote yet else fail sliently*
                if (!reportTraffic.upvote.includes(reportTrafficrentIdToken)) {
                  // Upvote
                  const id = reportTraffic.id
                  r.table('reportTrafficList').get(id).update({
                    upvote: r.row('upvote').append(reportTrafficrentIdToken)
                  }).run(connection).then(() => {
                    res.status(200)
                  }).catch(err => {
                    res.status(400).send(err)
                  }).finally(() => {
                    resolve(false)
                  })
                } else {
                  res.status(200)
                  resolve(false)
                }

                // Stop reportTrafficsor iterate
                return false
              }
            }, () => {
              /**
               * If promise have been resolve by resolve(false) above
               * this will not do anything
               */
              resolve(true)
            })
          })
        })
        .then(shoudContinueProcess => {
          if (shoudContinueProcess) {
            /**
             * Insert new report traffic
             */
            let insertObject = req.body

            insertObject.status = 1
            insertObject.upvote = []
            insertObject.comments = []

            if (req.files) {
              insertObject.images = []
              for (let file of req.files) {
                insertObject.images.push(file)
              }
            }

            /**
            * Check if this report traffic should be link
            * If yes then then link'em up
            */

            let linkList = []
            r.table('reportTrafficList')
              .filter({
                'status': 1,
                'reportTrafficType': req.body.reportTrafficType
              })
              .run(connection)
              .then(reportTrafficsor => { // Link
                reportTrafficsor.each((err, reportTraffic) => {
                  if (err) {
                    res.status(400).send(err)
                  } else {
                    const reportTrafficLocation = reportTraffic.location
                    const distance = helper.getDistance(reportTrafficLocation, req.body.location)
                    if (distance <= LINK_DIAMETER) { /** Location is linkable */
                      linkList.push({
                        origin: reportTrafficLocation,
                        destination: req.body.location
                      })
                    }
                  }
                }, () => {
                  r.table('reportTrafficLinks').insert(linkList)
                    .run(connection)
                    .then((res) => {
                      return r.table('reportTrafficLinks').run(connection)
                    })
                    .then((res) => {
                      res.toArray().then(res => {
                        return r.table('reportTrafficList')
                          .insert(insertObject)
                          .run(connection)
                      })

                    })
                    .then(information => res.json(information))
                    .catch(err => {
                      res.status(400).send(err)
                    })

                })
              })
              .catch(err => {
                res.status(400).send(err)
              })
          }
        })
        .catch(err => {
          res.status(400).send(err)
        })
    })

  return app
}

module.exports = createApp
