require('../src/db/mongoose');
const Task = require('../src/models/task');

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
}

deleteTaskAndCount('60073a68f2607f2088c21c1d').then((count) => {
  console.log(count)
}).catch((err) => {
  console.log(err)
})