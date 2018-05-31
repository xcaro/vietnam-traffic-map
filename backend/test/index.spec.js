/* eslint-disable */
const r = require('rethinkdb')
const request= require('supertest');
const createApp = require('../index')
const helper = require('../helper')
const app = createApp('test')
const expect = require('chai').expect;

describe('reportTraffic', function() {
  beforeEach(async (done) => {
    let conn = null
    try {
      conn =  await helper.createConnection()
      await helper.intiDb(conn)

      /**
       * Truncate db for test purpose
       * Remove later
       */
      const promises = [
        r.table('reportTrafficList').delete().run(conn),
        r.table('reportTrafficLinks').delete().run(conn),
        r.table('trafficAdministrators').delete().run(conn)
      ]

      Promise.all(promises)
      done()
    } catch (err) {
      done(err)
      conn.close()
      return
    }
  })

  it("should add new traffic report", async (done) => {
    let connection = null
    try {
      let createTrafficResult = await request(app)
        .post('/trafficReport')
        .send({
          location:{
            lat: 43.846526,
            lng: -71.672359
          },
          reportTrafficType: 'test',
        })
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()

      countTrafficRePortResult = await r.table("reportTrafficList")
        .count()
        .run(connection)

      expect(countTrafficRePortResult).to.be.equal(1)
      done()

    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should upvote instead of add new if location is too close", async (done) => {
    let connection = null
    let generatedKey = ""

    try {
      let firstTrafficReportId = await helper.createTrafficReportAndReturnId(app)
      connection = await helper.createConnection()

      await request(app)
      .post('/trafficReport')
      .send({
        location:{
          lat: 100.846526,
          lng: -80.672359
        },
        reportTrafficType: 'test',
      })
      .set('Authorization', 'abc123')
      .expect(200)

      let firstTrafficReport = await r.table('reportTrafficList').get(firstTrafficReportId).run(connection)
      expect(firstTrafficReport.upvotes.length).to.be.equal(1)
      done()

    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should link traffic report and when it close enough", async (done) => {
    let connection = null
    try {
      await request(app)
        .post('/trafficreport')
        .send({
          location:{
            lat: 100.846526,
            lng: 100.846526
          },
          reportTrafficType: 'test',

        })
        .set('Authorization', 'abc123')
        .expect(200)

      await request(app)
        .post('/trafficReport')
        .send({
          location:{
            lat: 100.846526,
            lng: 100.746526
          },
          reportTrafficType: 'test',

        })
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      let numReportTrafficLink = await r.table('reportTrafficLinks').count().run(connection)

      expect(numReportTrafficLink).to.be.equal(1)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

   it("should upvote traffic report",async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)
      await request(app)
        .get(`/trafficreport/upvote/${firstTrafficReportId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      firstTrafficReport = await r.table('reportTrafficList').get(firstTrafficReportId).run(connection)
      expect(firstTrafficReport.upvotes.length).to.be.equal(1)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should downvote traffic report",async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)
      await request(app)
        .get(`/trafficreport/downvote/${firstTrafficReportId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      firstTrafficReport = await r.table('reportTrafficList').get(firstTrafficReportId).run(connection)
      expect(firstTrafficReport.downvotes.length).to.be.equal(1)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should upvote traffic report", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)
      await request(app)
        .get(`/trafficReport/upvote/${reportTrafficId}`)
        .send({

        })
        .expect(200)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.upvotes.length).to.be.equal(1)

    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should not upvote traffic report twice", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
          .get(`/trafficReport/upvote/${reportTrafficId}`)
          .set('Authorization', 'abc123')
          .expect(200)

      await request(app)
        .get(`/trafficReport/upvote/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(400)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.upvotes.length).to.be.equal(1)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should remove downvote and add upvote traffic report", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
          .get(`/trafficReport/downvote/${reportTrafficId}`)
          .set('Authorization', 'abc123')
          .expect(200)

      await request(app)
        .get(`/trafficReport/upvote/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.upvotes.length).to.be.equal(1)
      expect(reportTraffic.downvotes.length).to.be.equal(0)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should not upvote traffic report twice", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
          .get(`/trafficReport/downvote/${reportTrafficId}`)
          .set('Authorization', 'abc123')
          .expect(200)

      await request(app)
        .get(`/trafficReport/upvote/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(400)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.upvotes.length).to.be.equal(1)
      expect(reportTraffic.downvotes.length).to.be.equal(1)

    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

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
    .set('Authorization', 'abc123')
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

  it("should unupvote succesfully traffic report", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
          .get(`/trafficReport/upvote/${reportTrafficId}`)
          .set('Authorization', 'abc123')
          .expect(200)

      await request(app)
        .get(`/trafficReport/unupvote/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.upvotes.length).to.be.equal(0)
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(5000000)

  it("should undownvote succesfully traffic report", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
          .get(`/trafficReport/downvote/${reportTrafficId}`)
          .set('Authorization', 'abc123')
          .expect(200)

      await request(app)
        .get(`/trafficReport/undownvote/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.downvotes.length).to.be.equal(0)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should add comment", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi'
        })
        .set('Authorization', 'abc123')
        .expect(200)

      connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.comments.length).to.be.equal(1)
      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should not add comment without comment include", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(400)

      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)



  it("should not add comment twice", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi'
        })
        .set('Authorization', 'abc123')
        .expect(200)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi'
        })
        .set('Authorization', 'abc123')
        .expect(400)

      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should edit comment", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi'
        })
        .set('Authorization', 'abc123')
        .expect(200)

      await request(app)
        .put(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi2'
        })
        .set('Authorization', 'abc123')
        .expect(200)

      let connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.comments[0].content).to.be.equal('ahihi2')

      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should delete comment", async (done) => {
    let generated_key = ""
    let connection = null

    try {
      let reportTrafficId = await helper.createTrafficReportAndReturnId(app)

      await request(app)
        .post(`/trafficReport/comment/${reportTrafficId}`)
        .send({
          comment: 'ahihi'
        })
        .set('Authorization', 'abc123')
        .expect(200)

      await request(app)
        .delete(`/trafficReport/comment/${reportTrafficId}`)
        .set('Authorization', 'abc123')
        .expect(200)

      let connection = await helper.createConnection()
      let reportTraffic = await r.table('reportTrafficList').get(reportTrafficId).run(connection)
      expect(reportTraffic.comments).to.be.eql([])

      done()
    } catch (err) {
      done(err)
    } finally {
      if (connection) {
        connection.close()
      }
    }
  }).timeout(50000)

  it("should not edit comment that not exist", async (done) => {
    try {
      await request(app)
        .delete(`/trafficReport/comment/1`)
        .send({
          comment: 'ahihi2'
        })
        .set('Authorization', 'abc123')
        .expect(400)
        done()
    }  catch (err) {
      done(err)
    }
  }).timeout(50000)

  it("should not delete comment that not exist", async (done) => {
    try {
      await request(app)
        .put(`/trafficReport/comment/1`)
        .send({
          comment: 'ahihi2'
        })
        .set('Authorization', 'abc123')
        .expect(400)
        done()
    }  catch (err) {
      done(err)
    }
  }).timeout(50000)
})

