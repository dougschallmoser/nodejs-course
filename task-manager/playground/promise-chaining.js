require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('600737359631521ecc538600', {age: 1 }).then((user) => {
  console.log(user)
  return User.countDocuments({ age: 1 })
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})

