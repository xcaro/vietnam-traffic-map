const WebSocket = require('ws')
const r = require('rethinkdb')

async function start () {
  try {
    /**
     * Connect database
     */
    const conn = await r.connect()
    conn.use('app')

    /**
     * Create socket server
     */
    const wss = new WebSocket.Server({ port: 8082 })
    wss.on('connection', (client) => {
      /**
       * Client setting subscribe rethinkdb data
       * WARNING : doesn't validate payload
       */
      client.on('message', (payload) => {
        const filterData = JSON.parse(payload)

        /**
         * Send all data base on filter
         *

        /**
         * Subscribe rethink data base on message request
         * Send all data base on update
         */
        r.table('activeTrafficReports')
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

              client.send(JSON.stringify(row))
            })

            /**
             * Close stream when :
             * Client disconnect
             * Client send new message
             */
            wss.on('close', () => {
              cursor.close()
            })

            client.on('message', () => {
              cursor.close()
            })
          })
      })
    })
  } catch (err) {
    console.log(err)
  }
}

start()
