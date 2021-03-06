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
    res.status(500).send()
  }
})

// GET request for all tasks
// Queries:
//   Attributes: /tasks?completed=false
//   Pagination: /tasks?limit=10&skip=0
//   Sorting: /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
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
      return res.sendStatus(404)
    }

    res.send(task)
  } catch (err) {
    return res.sendStatus(500)
  }
})

module.exports = router