const WebSocket = require('ws')
const r = require('rethinkdb')



async function start () {
  try {


    /**
     * Create socket server
     */


    const wss = new WebSocket.Server({ port: 8082 })
    wss.on('connection', async (client) => {
      /**
       * Connect database
       */
      const conn = await r.connect()
      conn.use('app')

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

            /**
             * Close stream when :
             * Client disconnect
             * Client send new message
             */
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
