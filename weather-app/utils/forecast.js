const request = require('request');

const forecast = (long, lat, callback) => {
  const apiKey = '626084a4345b71dfda81a42b88ca1da2'
  const weatherURL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${long}&units=f`

  request({ url: weatherURL, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather service.')
    } else if (response.body.error) {
      callback(response.body.error.info)
    } else {
      const current = response.body.current;
      callback(undefined, response.body.current.weather_descriptions[0] + '. ' + `It is currently ${current.temperature} degrees out. There is ${current.cloudcover}% cloud cover.`)
    }
  })
}

module.exports = forecast;