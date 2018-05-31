const r = require('rethinkdb')
const servicesAccount = require('./firebase_adminsdk_key.json')
const admin = require('firebase-admin')
const request = require('supertest')

admin.initializeApp({
  credential: admin.credential.cert(servicesAccount),
  databaseURL: 'https://vietnam-traffic-map.firebaseio.com'
})

const isOnTest = global.it

module.exports = {
  async intiDb (conn, dbName = 'app') {
    const promises = [
      this.createDatabase(conn, dbName),
      this.createtableIfNotExist(conn, 'reportTrafficList'),
      this.createtableIfNotExist(conn, 'reportTrafficLinks'),
      this.createtableIfNotExist(conn, 'trafficAdministrators')
    ]

    await Promise.all(promises)
  },

  getFirebaseAdminSdk () {
    return admin
  },

  createDatabase (con, dbName) {
    return r.dbList().contains(dbName)
      .do(function (databaseExists) {
        return r.branch(
          databaseExists,
          { dbs_created: 0 },
          r.dbCreate(dbName)
        )
      }).run(con)
  },

  createtableIfNotExist (con, tableName) {
    return r.tableList().contains(tableName)
      .do(function (databaseExists) {
        return r.branch(
          databaseExists,
          { tables_created: 0 },
          r.tableCreate(tableName)
        )
      }).run(con)
  },

  rad (x) {
    return x * Math.PI / 180
  },

  getDistance (p1, p2) {
    var R = 6378137 // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat)
    var dLong = this.rad(p2.lng - p1.lng)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d // returns the distance in meter
  },

  async createConnection (dbName = 'app') {
    try {
      let conn = await r.connect({ host: 'localhost', port: 28015 })
      conn.use(dbName)
      return conn
    } catch (err) {
      throw err
    }
  },

  async createTrafficReportAndReturnId (app) {
    try {
      let reportTrafficRes = await request(app)
        .post('/trafficReport')
        .send({
          location: {
            lat: 100.846526,
            lng: 100.846526
          },
          reportTrafficType: 'test'
        })
        .set('Authorization', 'abc123')

      let reportTrafficId = reportTrafficRes.body.generated_keys[0]
      return reportTrafficId
    } catch (err) {
      throw err
    }
  },

  createCheckSchemeTrafficReportExist () {
    return {
      id: {
        in: ['params'],
        exists: {
          errorMessage: 'id không tồn tại'
        },

        custom: {
          options: async (id) => {
            /**
             * Validate using firebase if not is on test mode
             * isOnTest false admin.verify
             */
            let connection = null
            try {
              connection = await this.createConnection()
              let reportTraffic = await r.table('reportTrafficList').get(id).run(connection)
              if (!reportTraffic) {
                throw new Error('reportTraffic không tồn tại')
              } else if (reportTraffic.status === 0) {
                throw new Error('reportTraffic này đã bị xóa')
              }

              return
            } catch (err) {
              throw err
            } finally {
              if (connection) {
                connection.close()
              }
            }
          }
        }
      }
    }
  },

  createCheckSchemeAuthentication () {
    return {
      authorization: {
        in: ['headers'],
        exists: {
          errorMessage: 'idToken không tồn tại'
        },

        custom: {
          options: (idToken) => {
            /**
             * Validate using firebase if not is on test mode
             * isOnTest false admin.verify
             */
            if (!isOnTest) {
              admin.auth().verifyIdToken(idToken)
                .then(function (decodedToken) {
                  idToken = decodedToken.uid
                  return Promise.resolve()
                }).catch(() => {
                  throw Error('idToken không hợp lệ')
                })
            } else {
              /**
              * Lorem is special for testing purpose
              */
              return Promise.resolve()
            }
          }
        }
      }
    }
  }
}
