const {gmaps} = require('../config');
const GoogleMapsAPI = require('googlemaps');

const polyline = require('polyline');
const geolib = require('geolib');
const _ = require('lodash');
const gm = new GoogleMapsAPI(gmaps);

var LOCATIONS_PER_REQUEST = 300;

function getDistances(points) {
  return points.map((point, index, all) => {
    if (index === 0) { return 0; }
    const [prevLat, prevLong] = all[index-1];
    const [lat, long] = point;
    return geolib.getDistance({latitude: lat, longitude: long}, {latitude:prevLat, longitude:prevLong})
  });
}

function getFullPath(route) {
  let fullPath = [];
  for(const leg of route.legs) {
    for(const step of leg.steps) {
      fullPath = fullPath.concat(polyline.decode(step.polyline.points));
    }
  }
  return fullPath;
}

function getPathBetweenTwoLocations({origin, destination}) {
  return new Promise((resolve, reject) => {
    gm.directions({
        origin,
        destination
      }, (error, directions) => {
        if (error) {
          reject(error);
        } else {
          const [route] = directions.routes;
          const points = getFullPath(route);
          resolve(points);
        }
      });
  });
}

exports.getPath = (locations) => {
  const locationPairs = locations.map((value, index) => ({origin: locations[index-1], destination: value}));
  const [, ...validPairs] = locationPairs;
  const pathPromises = validPairs.map(getPathBetweenTwoLocations);
  return new Promise((resolve, reject) => {
    Promise.all(pathPromises)
      .then(paths => resolve(_.concat.apply(null, paths)))
      .catch(reject);
  });
};

function getElevationsSingleRequest(points) {
  return new Promise((resolve, reject) => {
    gm.elevationFromLocations({
      locations: points.map(point => point.join(',')).join('|')
    }, (error, result) => {
      if (error || result.status !== 'OK') {
        reject(error);
      } else {
        resolve(result.results.map(r => r.elevation))
      }
    });
  });
}

exports.getElevations = (points) => {
  return new Promise((resolve, reject) => {
    const chunks = _.chunk(points, LOCATIONS_PER_REQUEST);
    Promise.all(chunks.map(getElevationsSingleRequest))
      .then(elevationChunks => resolve(_.concat.apply(null, elevationChunks)))
      .catch(reject);
  });
}
