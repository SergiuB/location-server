var r = require('rethinkdb');

class CoordinateService {
  constructor({connection, dbName, tableName}) {
    this.connection = connection;
    this.dbName = dbName;
    this.tableName = tableName;
  }
  storeCoordinates(coords){
    const {connection, dbName, tableName} = this;
    return r.db(dbName).table(this.tableName).insert([ coords ]).run(connection);
  }

  getAllCoordinates() {
    const {connection, dbName, tableName} = this;
    return r.db(dbName).table(tableName).run(connection)
      .then(cursor => new Promise(resolve => resolve(cursor.toArray())));
  }
} 

exports.getCoordinateServiceInstance = (config) => new CoordinateService(config);
