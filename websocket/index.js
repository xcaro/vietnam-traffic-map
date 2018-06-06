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
        console.log(payload)
        /**
         * Subscribe rethink data base on message request
         */
        // r.table('activeTrafficReport')
        //   .filter()
        //   .changes()
        //   .run(conn, (err, cursor) => {
        //     if (err) {
        //       throw err
        //     }
        //   })
      })
    })
  } catch (err) {
    console.log(err)
  }
}

start()
