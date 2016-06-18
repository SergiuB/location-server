var r = require('rethinkdb');

class CoordinateService {
  constructor(connection) {
    this.connection = connection;;
  }
  storeCoordinates(coords){
    return r.table('coordinates').insert([ coords ]).run(this.connection);
  }

  getAllCoordinates() {
    return r.db('test').table('coordinates').run(this.connection)
      .then(cursor => new Promise(resolve => resolve(cursor.toArray())));
  }
}

exports.getCoordinateServiceInstance = conn => new CoordinateService(conn);
