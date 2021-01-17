const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Creates new instance of express application
const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Sets up template directory as name "templates" instead of "views"
app.set('views', viewsPath)
// Setup handlebars (dynamic template) in express
app.set('view engine', 'hbs')
// Setup partials
hbs.registerPartials(partialsPath)

// Loads static html files in public folder
app.use(express.static(publicDirectoryPath))

// Sends handlebars index.hbs file to root
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Doug Schallmoser'
  })
})

// Sends handlebars about.hbs file to /about
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Doug Schallmoser'
  })
})

// Sends handlebars help.hbs file to /help
app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Doug Schallmoser',
    message: 'Do you need help?'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'A valid address must be provided'
    })
  }

  geocode(req.query.address, (error, data) => {
    if (error) {
      return res.send({ error })
    }
    
    const { longitude, latitude, location } = data;
    
    forecast(longitude, latitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        address: req.query.address,
        location,
        forecast: forecastData
      })

    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  res.send({
    products: []
  })
})

// Renders 404 for any match after /help/
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Doug Schallmoser',
    error: 'Help article not found.'
  })
})

// Renders 404 for all other routes
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Doug Schallmoser',
    error: 'Page not found.'
  })
})

// Sets server port
app.listen(3000, () => {
  console.log('Server is up on port 3000')
}) 