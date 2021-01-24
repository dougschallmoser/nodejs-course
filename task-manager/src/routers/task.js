const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router;

// GET request for a single task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.send(500).send()
  }
})

// GET request for all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    // alternative: await req.user.populate('tasks').execPopulate()
    res.send(tasks)
  } catch (err) {
    res.status(500).send()
  }
})

// POST request for creating a new Task
router.post('/tasks', auth, async(req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

// PATCH request for updating a task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ['description', 'completed'];

  // Code to determine if update body has valid attributes/values
  const isValidOperation = updates.every((update) => allowUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    
    if (!task) {
      return res.status(404).send()
    }
    
    updates.forEach((update) => task[update] = req.body[update])
    await task.save();
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

// DELETE request for removing task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.send(404).send()
    }

    res.send(task)
  } catch (err) {
    return res.status(500).send()
  }
})

module.exports = router