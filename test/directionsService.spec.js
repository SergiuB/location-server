const directionsService = require('../services/directionsService');
const expect = require('chai').expect;

describe('DirectionsService', () => {
  it('returns a path between two coordinates', (done) => {
    directionsService.getPath({ origin: 'Bucharest, Romania', destination: 'Moscow, Russia' })
      .then((path) => {
        const firstPoint = path[0];
        const lastPoint = path[path.length - 1];
        const [expectedFirstPoint, expectedLastPoint] = [[ 44.42659, 26.10278 ], [ 55.75615, 37.6172 ]];

        expect(firstPoint).to.deep.equal(expectedFirstPoint);
        expect(lastPoint).to.deep.equal(expectedLastPoint);
        done();
      })
      .catch(done);
  });
});
