const express = require('express');
const Task = require('../models/task');
const router = new express.Router;

// GET request for a single task
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (err) {
    res.send(500).send()
  }
})

// GET request for all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks)
  } catch (err) {
    res.status(500).send()
  }
})

// POST request for creating a new Task
router.post('/tasks', async(req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

// PATCH request for updating a task
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ['description', 'completed'];

  // Code to determine if update body has valid attributes/values
  const isValidOperation = updates.every((update) => allowUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const user = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

// DELETE request for removing task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.send(404).send()
    }

    res.send(task)
  } catch (err) {
    return res.status(500).send()
  }
})

module.exports = router