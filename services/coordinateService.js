var r = require('rethinkdb');

function toLatLong(dbCoord) {
  const [long, lat] = dbCoord.location.coordinates;
  return { lat, long };
}

class CoordinateService {
  constructor({connection, dbName, tableName}) {
    this.connection = connection;
    this.dbName = dbName;
    this.tableName = tableName;
  }
  storeCoordinates(coords){
    const {connection, dbName, tableName} = this;
    const point = r.point(coords.long, coords.lat);
    return r.db(dbName).table(this.tableName).insert([{location: point}]).run(connection);
  }

  getAllCoordinates() {
    const {connection, dbName, tableName} = this;
    return r.db(dbName).table(tableName).run(connection)
      .then(cursor => new Promise(resolve => resolve(cursor.toArray().map(toLatLong))));
  }
}

exports.getCoordinateServiceInstance = (config) => new CoordinateService(config);
