const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000

// Custom middleware between a new request and running 
// route handler
// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled')
//   } else {
//     next will continue executing route handlers
//     next()
//   }
// })

// app.use((req, res, next) => {
//   res.status(503).send('The site is under maintenance, try back soon')
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Set listening Port
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})