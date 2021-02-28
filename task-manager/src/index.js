const app = require ('./app');

const port = process.env.PORT || 3000

// Set listening Port
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})