const directionsService = require('../services/directionsService');
describe('DirectionsService', () => {
  it('returns a path between two coordinates', (done) => {
    directionsService.getPath({ origin: 'Bucharest, Romania', destination: 'Moscow, Russia' })
      .then((path) => {
        done();
      })
      .catch(done);
  });
});
