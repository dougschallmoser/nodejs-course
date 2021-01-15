const http = require('http');

const apiKey = '626084a4345b71dfda81a42b88ca1da2'
const weatherURL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=40,-75&units=f`

const request = http.request(weatherURL, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk.toString();
  })

  response.on('end', () => {
    const body = JSON.parse(data);
    console.log(body);
  })

})

request.on('error', (err) => {
  console.log('An error: ', err)
})

request.end();