const expect = require('chai').expect;
const coordinateServiceFactory = require('../services/coordinateService');
var r = require('rethinkdb');
var config = require('../config.test');
const coordTable = "coordinates";

describe('CoordinateService', () => {
  let service;

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
        service = coordinateServiceFactory.getCoordinateServiceInstance({
          connection: conn,
          dbName: config.rethinkdb.db,
          tableName: coordTable});
        done();
      })
  });

  it('stores coordinates', (done) => {
    const sampleCoords = {lat: 1, long: 2};
    service.storeCoordinates(sampleCoords)
      .then(service.getAllCoordinates.bind(service))
      .then(([first, ...rest]) => {
        const {id, lat, long} = first;
        expect({lat, long}).to.deep.equal(sampleCoords);
        done();
      })
      .catch(done);
  });
})
