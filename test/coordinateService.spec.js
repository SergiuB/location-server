const expect = require('chai').expect;
const coordinateServiceFactory = require('../services/coordinateService');
var r = require('rethinkdb');
var config = require('../config.test');
const coordTable = "test_coordinates";

describe('CoordinateService', () => {
  let service;
  let connection;

  const resolvedPromise = (data) => () => new Promise(resolve => resolve(data));

  const createDbIfNeeded = (conn) => {
    return r.dbList().contains(config.rethinkdb.db)
      .do(containsDb => r.branch(containsDb, {created: 0}, r.dbCreate(config.rethinkdb.db)))
      .run(conn)
      .then(resolvedPromise(conn));
  };

  const createTableIfNeeded = (conn) => {
    return r.tableList().contains(coordTable)
      .do(containsTable => r.branch(containsTable, {created: 0}, r.tableCreate(coordTable)))
      .run(conn)
      .then(resolvedPromise(conn));
  };

  before((done) => {
    r.connect(config.rethinkdb)
      .then(createDbIfNeeded)
      .then(createTableIfNeeded)
      .then(conn => {
        connection = conn;
        service = coordinateServiceFactory.getCoordinateServiceInstance({
          connection: conn,
          dbName: config.rethinkdb.db,
          tableName: coordTable});
        done();
      })
  });

  it('stores coordinates', (done) => {
    const sampleCoords = {lat: Math.random(), long: Math.random()};
    service.storeCoordinates(sampleCoords)
      .then(service.getAllCoordinates.bind(service))
      .then(([first, ...rest]) => {
        expect(first).to.deep.equal(sampleCoords);
        done();
      })
      .catch(done);
  });

  after((done) => {
    r.db(config.rethinkdb.db).tableDrop(coordTable).run(connection)
      .then(() => done());
  });
})
