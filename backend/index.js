const express = require('express')
const trafficReportRoute = require('./route/trafficsreport')
const https = require('https');
const http = require('http');
const cors = require('cors')
const fs = require('fs')
const app = express()

const privateKey = fs.readFileSync('localhost.key');
const certificate = fs.readFileSync('localhost.crt');
const credentials = {key: privateKey, cert: certificate};

function createApp () {
  app.use(express.json())
  app.use('/trafficreport', trafficReportRoute)
  return app
}

module.exports = createApp
https.createServer(credentials,app).listen(3000)

// createApp('traffic', true).listen(3000, () => console.log('Server listening on port 3000!'))
