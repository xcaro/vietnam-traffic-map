/* eslint-disable */
const r = require('rethinkdb')
const request = require('supertest');
const createApp = require('../app')
const helper = require('../helper')
const app = createApp('test', true)
const expect = require('chai').expect;


describe('reportTraffic', function() {
  let connection = null

  before(function(done) {
    r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
      if (err) throw err

      connection = conn
      helper.createDatabase(connection, 'test')
      connection.use('test')

      /**
       * Truncate db for test purpose
       * Remove later
       */
      const promises = [
        r.table('reportTrafficList').delete().run(connection),
        r.table('reportTrafficLinks').delete().run(connection),
        r.table('trafficAdministrators').delete().run(connection)
      ]

      /**
       * Test
       */
      Promise.all(promises).then(() => {
        done()
      })
    })
  });

  it("should add new traffic report", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 43.846526,
        lng: -71.672359
      },
      reportTrafficType: 'test',
      idToken: "lorem"
    })
    .expect(200)
    .end((err, res) => {
      /**
       * Check again for database to make sure that new traffic
       * Report is succesfully added
       */
      if (err) {
        done(err)
      }
      else {
        /**
         * Return data.generated key
         * Check again if data with generated key exist on the server
         */
        r.table("reportTrafficList")
        .count()
        .run(connection, (err, res) => {
          expect(res).to.be.equal(1)
          done()
        })
      }
    })
  }).timeout(50000)

  it("should upvote instead of add new if location is too close", (done) => {
    let generatedKey = ""
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 100.846526,
        lng: -80.672359
      },
      reportTrafficType: 'test',
      idToken: "lorem2"
    })
    .expect(200)
    .then(res => {
      expect(res.body).to.contain.keys('generated_keys')
      generatedKey = res.body.generated_keys[0]
      return request(app)
      .post('/trafficReport')
      .send({
        location:{
          lat: 100.846526,
          lng: -80.672359
        },
        reportTrafficType: 'test',
        idToken: "lorem2"
      })
      .expect(200)
    })
    .then(res => {
      /**
       * Return generated key then
       * use generated to check if upvote of report traffic is 1
       */
      return r.table('reportTrafficList').get(generatedKey).run(connection)
    })
    .then(res => {
      expect(res.upvote.length).to.be.equal(1)
      expect(res.upvote[0]).to.be.equal("lorem2")
      done()
    })
    .catch(err => {
      done(err)
    })

  }).timeout(50000)

  it("should link traffic report and when it close enough", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 100.846526,
        lng: 100.846526
      },
      reportTrafficType: 'test',
      idToken: "lorem2"
    })
    .expect(200)
    .then(() => {
        return request(app)
        .post('/trafficReport')
        .send({
          location:{
            lat: 100.846526,
            lng: 100.746526
          },
          reportTrafficType: 'test',
          idToken: "lorem2"
        })
        .expect(200)
    })
    .then(() => {
      return r.table('reportTrafficLinks').count().run(connection)
    }).then(numReportTrafficLink => {
      expect(numReportTrafficLink).to.be.equal(1)
      done()
    })
    .catch(err => {
      done(err)
    })
  }).timeout(50000)


  it("should remove traffic report and it's link", (done) => {
    done()
  }).timeout(50000)

  it("should remove traffic report", (done) => {
    done()
  }).timeout(50000)

  it("should validate only image is allowed to be uploaded", (done) => {
    done()
  }).timeout(50000)

  it("should not allow to use this api without authenticate", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 100.846526,
        lng: -80.672359
      },

      reportTrafficType: 'test'
    })
    .end((err, res) => {
      done(err)
    })
  })

  it("should validate location wrong scheme", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 43.846526,
      },

      reportTrafficType: 'test'
    })
    .expect(400)
    .end((err, res) => {
      done(err)
    })
  }).timeout(50000)

  it("should validate location required", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      reportTrafficType: 'test',
      idToken: "lorem"
    })
    .expect(400)
    .end((err, res) => {
      done(err)
    })
  }).timeout(50000)

  it("should validate reportTrafficType required", (done) => {
    request(app)
    .post('/trafficReport')
    .send({
      location:{
        lat: 43.846526,
        lng: -71.672359
      },
      idToken: "lorem"
    })
    .expect(400)
    .end((err, res) => {
      done(err)
    })
  }).timeout(50000)
})

