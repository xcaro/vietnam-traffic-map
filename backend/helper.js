const r = require('rethinkdb')

module.exports = {
  createDatabase (con, dbName) {
    r.dbList().contains(dbName)
      .do(function (databaseExists) {
        return r.branch(
          databaseExists,
          { dbs_created: 0 },
          r.dbCreate(dbName)
        )
      }).run(con)
  },

  createtableIfNotExist (con, tableName) {
    // r.tableList().contains(tableName)
    //     .do(empty => r.branch(
    //         empty, // equivalent of if(empty)
    //         { tables_created: 0 },
    //         r.tableCreate(tableName) // create table
    //     )).run(connection)
    r.tableList().contains(tableName)
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
  }
}
