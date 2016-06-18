exports.storeCoordinates = ({lat, long}) => {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

exports.getAllCoordinates = () => {
  return new Promise((resolve, reject) => {
    resolve([{lat: 1, long: 2}]);
  });
}
