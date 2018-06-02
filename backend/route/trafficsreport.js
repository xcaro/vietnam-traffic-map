const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const helper = require('../helper')
const r = require('rethinkdb')
const NEAR_DIAMETER = 1000
const LINK_DIAMETER = 4000
const isOnTest = global.it // test by mocha or not
const MAX_DOWNVOTE = isOnTest ? 1 : 3
const mustAuth = helper.createCheckSchemeAuthentication(isOnTest)
const mustValidateTrafficReport = helper.createCheckSchemeTrafficReportExist()
const admin = helper.admin

const {
  checkSchema,
  validationResult
} = require('express-validator/check')

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

router.get('/isauth', (req, res) => {
  let idToken = req.headers.authorization
  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      res.sendStatus(200)
    }).catch(() => {
      res.sendStatus(403)
    })
})

router.route('/comment/:id')
  .post(checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport, {
    comment: {
      in: ['body'],
      exists: {
        message: 'comment không tồn tại'
      }
    }
  })), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let connection = null
    let idToken = req.headers.authorization

    try {
      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(req.params.id).run(connection)

      let isHaveComment = reportTraffic.comments.find((comment) => {
        return comment.userId === idToken
      })

      if (isHaveComment) {
        res.sendStatus(400)
        return
      }

      await r.table('reportTrafficList')
        .get(req.params.id)
        .update({
          comments: r.row('comments')
            .append({
              userId: idToken,
              content: req.body.comment,
              time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
              status: 1
            })
        })
        .run(connection)

      res.json(200)
    } catch (err) {
      res.status(400).json(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })
  .put(checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport, {
    comment: {
      in: ['body'],
      exists: {
        message: 'comment không tồn tại'
      }
    }
  })), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let connection = null
    let idToken = req.headers.authorization

    try {
      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(req.params.id).run(connection)

      let commentIndex = reportTraffic.comments.findIndex((comment) => {
        return comment.userId === idToken
      })

      if (commentIndex === -1) {
        res.sendStatus(400)
        return
      }

      await r.table('reportTrafficList')
        .get(req.params.id)
        .update({
          comments: r.row('comments').changeAt(commentIndex, {
            userId: idToken,
            content: req.body.comment,
            time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
          })
        })
        .run(connection)

      res.json(200)
    } catch (err) {
      res.status(400).json(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })
  .delete(checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport, {
    comment: {
      in: ['body'],
      exists: {
        message: 'comment không tồn tại'
      }
    }
  })), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let connection = null
    let idToken = req.headers.authorization

    try {
      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(req.params.id).run(connection)

      let commentIndex = reportTraffic.comments.findIndex((comment) => {
        return comment.userId === idToken
      })

      if (commentIndex === -1) {
        res.sendStatus(400)
        return
      }

      await r.table('reportTrafficList')
        .get(req.params.id)
        .update({
          comments: r.row('comments').deleteAt(commentIndex)
        })
        .run(connection)

      res.json(200)
    } catch (err) {
      res.status(400).json(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })

router.get('/unupvote/:id', checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport)), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let connection = null
  let idToken = req.headers.authorization

  try {
    connection = await helper.createConnection()
    let reportTraffic = await r.table('reportTrafficList').get(req.params.id).run(connection)
    let index = reportTraffic.upvotes.indexOf(idToken)
    if (index !== -1) {
      await r.table('reportTrafficList')
        .get(req.params.id)
        .update({
          upvotes: r.row('upvotes').deleteAt(index)
        })
        .run(connection)
    }

    res.sendStatus(200)
  } catch (err) {
    res.status(400).json(err)
  } finally {
    if (connection) {
      connection.close()
    }
  }
})

router.get('/undownvote/:id', checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport)), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let connection = null
  let idToken = req.headers.authorization

  try {
    connection = await helper.createConnection()
    let reportTraffic = await r.table('reportTrafficList').get(req.params.id).run(connection)
    let index = reportTraffic.downvotes.indexOf(idToken)
    if (index !== -1) {
      await r.table('reportTrafficList')
        .get(req.params.id)
        .update({
          downvotes: r.row('downvotes').deleteAt(index)
        })
        .run(connection)
    }

    res.sendStatus(200)
  } catch (err) {
    res.status(400).json(err)
  } finally {
    if (connection) {
      connection.close()
    }
  }
})

/**
 * Upvote
 */
router.get('/upvote/:id', checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport)), async (req, res) => {
  /**
   * Express validator error
   */
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let connection = null
  let idToken = req.headers.authorization
  try {
    connection = await helper.createConnection()
    let reportTraffic = await r.table('reportTrafficList')
      .get(req.params.id)
      .run(connection)

    if (reportTraffic.upvotes.includes(idToken)) {
      res.status(400).json({
        'message': 'reportTraffic đã được upvote rồi'
      })
      return
    }

    await r.table('reportTrafficList').get(req.params.id).update({
      upvotes: r.row('upvotes').append(idToken)
    }).run(connection)

    /***
   * Check if have been down_vote by same person
   * if yes then remove that down_vote
   */
    let index = -1
    if ((index = reportTraffic.downvotes.indexOf(idToken)) !== -1) {
      await r.table('reportTrafficList').update({
        downvotes: r.row('downvotes').deleteAt(index)
      }).run(connection)
    }

    res.sendStatus(200)
  } catch (err) {
    res.status(400).json(err)
  } finally {
    if (connection) {
      connection.close()
    }
  }
})

/**
 * Downvote
 */
router.get('/downvote/:id',
  checkSchema(Object.assign({}, mustAuth, mustValidateTrafficReport)), async (req, res) => {
  /**
     * Express validator error
     */
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let connection = null
    let idToken = req.headers.authorization
    try {
      let connection = await helper.createConnection()

      let reportTraffic = await r.table('reportTrafficList')
        .get(req.params.id)
        .run(connection)

      if (reportTraffic.downvotes.includes(idToken)) {
        res.status(400).json({
          'message': 'reportTraffic đã được downvote rồi'
        })
        return
      }

      await r.table('reportTrafficList').get(req.params.id).update({
        downvotes: r.row('downvotes').append(idToken)
      }).run(connection)

      let index
      if ((index = reportTraffic.upvotes.indexOf(idToken)) !== -1) {
        r.table('reportTrafficList').update({
          upvotes: r.row('upvotes').deleteAt(index)
        }).run(connection)
      }

      if (reportTraffic.downvotes.length + 1 >= MAX_DOWNVOTE) {
        await r.table('reportTrafficLinks').filter(
          r.row('origin').eq(reportTraffic.location).or(
            r.row('destination').eq(reportTraffic.location)
          )
        ).update({
          status: 0
        }).run(connection)
      }

      res.send(200)
    } catch (err) {
      res.status(400).json(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })

/**
 * Create traffic report
 */
router.post('/',
  checkSchema({
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
  }), upload.array('images'), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    /**
     * Express validator error
     */
    let connection = null
    try {
      connection = await helper.createConnection()
    } catch (err) {
      res.status(400).json(err)
      return
    }

    const idToken = req.headers.authorization

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
          reportTrafficsor.each(
            (err, reportTraffic) => {
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
                if (!reportTraffic.upvotes.includes(idToken)) {
                  // Upvote
                  const id = reportTraffic.id
                  r.table('reportTrafficList').get(id).update({
                    upvotes: r.row('upvotes').append(idToken)
                  }).run(connection).then(() => {
                    res.sendStatus(200)
                  }).catch(err => {
                    res.status(400).json(err)
                  })
                } else {
                  res.sendStatus(200)
                }

                // Stop reportTrafficsor iterate
                resolve(false)
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
          insertObject.downvotes = []
          insertObject.upvotes = []
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
              return reportTrafficsor.eachAsync(
                (reportTraffic) => {
                  const reportTrafficLocation = reportTraffic.location
                  const distance = helper.getDistance(reportTrafficLocation, req.body.location)
                  if (distance <= LINK_DIAMETER) { /** Location is linkable */
                    linkList.push({
                      origin: reportTrafficLocation,
                      destination: req.body.location,
                      status: 1
                    })
                  }
                })
            }).then(() => {
              r.table('reportTrafficLinks').insert(linkList)
                .run(connection)
                .then((res) => {
                  return r.table('reportTrafficList')
                    .insert(insertObject)
                    .run(connection)
                })
                .then(information => {
                  res.json(
                    {generated_keys: information.generated_keys}
                  )
                })
                .catch(err => {
                  res.status(400).json(err)
                })
            })
            .catch(err => {
              res.status(400).json(err)
            })
        }
      })
      .catch(err => {
        res.status(400).json(err)
      })
  })

module.exports = router
