const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast');

const city = process.argv[2];

if (!city) {
  return console.log('Please provide an address')
}

geocode(city, (error, data) => {
  if (error) {
    return console.log('Error: ', error)
  }
  
  const { longitude, latitude, location } = data;
  
  forecast(longitude, latitude, (error, forecastData) => {
    if (error) {
      return console.log('Error', error)
    }

    console.log(location)
    console.log(forecastData)
  })
})