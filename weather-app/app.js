const request = require('request');

// const weatherURL = 'http://api.weatherstack.com/current?access_key=626084a4345b71dfda81a42b88ca1da2&query=37.8267,-122.4233&units=f'

// request({ url: weatherURL, json: true }, (error, response) => {
//   if (error) {
//     console.log('Unable to connect to weather service.')
//   } else if (response.body.error) {
//     console.log(response.body.error.info)
//   } else {
//     const current = response.body.current;
//     console.log(response.body.current.weather_descriptions[0] + '. ' + `It is currently ${current.temperature} degrees out. There is ${current.cloudcover}% cloud cover.`)
//   }
// })


// GEOCODING EXAMPLE:
const geocodeToken = 'pk.eyJ1IjoiZG91Z3NjaGFsbG1vc2VyIiwiYSI6ImNranhka3ZsZDAxeGwydHMyb3QxeW1wZnYifQ.HWixoNV0eNvYWFSw7CGipw'
const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=${geocodeToken}`

request({ url: geocodeURL, json: true }, (error, response) => {
  if (error) {
    console.log('Unable to connect to geocode service.')
  } else if (!response.body.features) {
    console.log(response.body.message)
  } else {
    const long = response.body.features[0].center[0]
    const lat = response.body.features[0].center[1]
    console.log(`Latitude is ${lat}. Longitude is ${long}.`)
  }
})