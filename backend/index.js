const express = require('express')
const trafficReportRoute = require('./route/trafficsreport')
const app = express()

function createApp () {
  app.use(express.json())
  app.use('/trafficreport', trafficReportRoute)
  return app
}

module.exports = createApp
createApp('traffic', true).listen(3000, () => console.log('Server listening on port 3000!'))
