require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('600785ea73e3ec3c91130548').then((task) => {
  console.log(task)
  return Task.countDocuments({ completed: false })
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})