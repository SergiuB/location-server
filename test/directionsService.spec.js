const GoogleMapsAPI = require('googlemaps');
const config = {
  "key": "AIzaSyB3Dnrf-DxB05UWJurWp3XDw5414Pc8ogw",
  "secure": true
};
var polyline = require('polyline');
var geolib = require('geolib');
var _ = require('lodash');


function getDistances(points) {
  return points.map((point, index, all) => {
    if (index === 0) { return 0; }
    const [prevLat, prevLong] = all[index-1];
    const [lat, long] = point;
    return geolib.getDistance({latitude: lat, longitude: long}, {latitude:prevLat, longitude:prevLong})
  });
}

describe('DirectionsService', () => {
  it('returns a path between two coordinates', (done) => {
    var gm = new GoogleMapsAPI(config);
    gm.directions({
        origin: 'Bucharest, Romania',
        destination: 'Moscow, Russia'
      }, (error, directions) => {
        let points = polyline.decode(directions.routes[0].overview_polyline.points);
        const [,...distances] = getDistances(points);
        console.log(_.take(distances, 10));

        const [start, second, third, ...others] = points;
        const [end] = others.reverse();

        console.log(start.join(','), end.join(','));

        console.log({min: _.min(distances), max: _.max(distances)});

        gm.directions({
            origin: second.join(','),
            destination: third.join(',')
          }, (error, directions) => {
            let points = polyline.decode(directions.routes[0].overview_polyline.points);
            const distances = getDistances(points);
            console.log(_.sum(distances));

            done();
          });
      });
  })
});
