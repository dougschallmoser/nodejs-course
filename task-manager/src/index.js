const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Set listening Port
app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
  // Associate tasks by their owner
  // const task = await Task.findById('600cb241f4a1f417805db38a')
  // await task.populate('owner').execPopulate()
  // console.log(task.owner)

  // associate owner by their tasks
  const user = await User.findById('600cb18899d2a916f90ae47d')
  await user.populate('tasks').execPopulate()
  console.log(user.tasks)
}

main()