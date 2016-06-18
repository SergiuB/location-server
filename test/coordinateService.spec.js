const expect = require('chai').expect
const coordinateService = require('../services/coordinateService');

describe('CoordinateService', () => {
  it('stores coordinates', (done) => {
    const sampleCoords = {lat: 1, long: 2};
    coordinateService.storeCoordinates(sampleCoords)
      .then(coordinateService.getAllCoordinates)
      .then(([first, ...rest]) => {
        expect(first).to.deep.equal(sampleCoords);
        done();
      })
      .catch(done);
  });
  it('returns all coordinates');
})
