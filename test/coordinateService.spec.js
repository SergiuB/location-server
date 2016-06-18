const expect = require('chai').expect;
const coordinateServiceFactory = require('../services/coordinateService');
var r = require('rethinkdb');
var config = require('../config');

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
    return r.tableList().contains('coordinates')
      .do(containsTable => r.branch(containsTable, {created: 0}, r.tableCreate('coordinates')))
      .run(conn)
      .then(resolvedPromise(conn));
  };

  before((done) => {
    r.connect(config.rethinkdb)
      .then(createDbIfNeeded)
      .then(createTableIfNeeded)
      .then(conn => {
        service = coordinateServiceFactory.getCoordinateServiceInstance(conn);
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
