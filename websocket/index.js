
const websocket = require('ws')
const r = require('rethinkdb')
let port = process.env.PORT || 8000

async function start () {
  try {

    /**
     * Create socket server
     */
    const wss = new websocket.Server({
      port
    }, () => {
      console.log('websocket listen on port ' + port)
    })
    wss.on('connection', async (client) => {
      console.log("client connected")
      /**
       * Connect database
       */
      const conn = await r.connect({
        host: 'deltavn.net',
        port: 8000
      })
      conn.use('app')


    /**
     * Subscribe rethink data base on message request
     * Send all data base on update
     */
      r.table('activeReports')
        .changes({
          'includeTypes': true,
          'includeInitial': true,
          "squash": true
        })
        .run(conn, async (err, cursor) => {
          if (err) {
            throw err
          }

          cursor.each((err, row) => {
            if (err) {
              console.log(err)
              throw err
            }

            client.on('close', () => {
              client.terminate()
              cursor.close()
              console.log("client disconnected")
              conn.close()
              return false // This will stop cursor from run
              // If it still run, it will yield error cursor has been closed

            })

            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify(row))
            } else {
              client.emit('close')
            }
          })
        })
      })
  } catch (err) {
    console.log(err)
  }
}

start()
