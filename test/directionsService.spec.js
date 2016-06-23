const directionsService = require('../services/directionsService');
const expect = require('chai').expect;

describe('DirectionsService', () => {
  // it('returns a path between two coordinates', (done) => {
  //   directionsService.getPath({ origin: 'Bucharest, Romania', destination: 'Chisinau, Moldavia' })
  //     .then((path) => {
  //       const firstPoint = path[0];
  //       const lastPoint = path[path.length - 1];
  //       const [expectedFirstPoint, expectedLastPoint] = [[ 44.42659, 26.10278 ], [ 55.75615, 37.6172 ]];
  //       console.log(path.length);
  //
  //       expect(firstPoint).to.deep.equal(expectedFirstPoint);
  //       expect(lastPoint).to.deep.equal(expectedLastPoint);
  //       done();
  //     })
  //     .catch(done);
  // });
  it('returns a path between multiple locations', (done) => {
    directionsService.getPath(['Bucharest, Romania', 'Chisinau, Moldavia', 'Moscow, Russia' ])
      .then((path) => {
        const firstPoint = path[0];
        const midPoint = path[8836];
        const lastPoint = path[path.length - 1];
        const [expectedFirstPoint, expectedMidPoint, expectedLastPoint] = [
          [ 44.42659, 26.10278 ], [ 47.00979, 28.86264 ], [ 55.75615, 37.6172 ]];

        expect(firstPoint).to.deep.equal(expectedFirstPoint);
        expect(midPoint).to.deep.equal(expectedMidPoint);
        expect(lastPoint).to.deep.equal(expectedLastPoint);
        done();
      })
      .catch(done);
  });
});
