const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

// test user
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Erin',
  email: 'erin@gmail.com',
  password: 'SoCoool66!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

// test user
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Doug',
  email: 'doug@gmail.com',
  password: 'UnCoool11!',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
}

// test task
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Walk the dog',
  completed: false,
  owner: userOneId
}

// test task
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Grocery shop',
  completed: true,
  owner: userOneId
}

// test task
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Learn Node',
  completed: true,
  owner: userTwoId
}

// Deletes all users in test database before running tests
// Adds a new user to be tested for logging in
const populateDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskThree,
  populateDatabase
}