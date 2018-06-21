
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
              throw err
            }

            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify(row))
            } else {
              client.terminate()
              cursor.close()
              conn.close()
              return false // This will stop cursor from run
              // If it still run, it will yield error cursor has been closed
            }
          })
        })
      })
  } catch (err) {
    console.log(err)
  }
}

start()
