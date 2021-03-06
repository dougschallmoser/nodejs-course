const request = require('request')

const geocode = (address, callback) => {
  const geocodeToken = 'pk.eyJ1IjoiZG91Z3NjaGFsbG1vc2VyIiwiYSI6ImNranhka3ZsZDAxeGwydHMyb3QxeW1wZnYifQ.HWixoNV0eNvYWFSw7CGipw'
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${geocodeToken}`

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to location services!')
    } else if (!response.body.features) {
      callback('Unable to find location. Try another search.')
    } else {
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name
      })
    }
  })
}

module.exports = geocode;