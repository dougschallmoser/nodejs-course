const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router;

// GET request for my profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// GET request for single user
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (err) {
    res.status(500).send()
  }
})

// POST request for creating a new User
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token})
  } catch (err) {
    res.status(400).send(err)
  }
})

// POST request for logging in
router.post('/users/login', async (req, res) => {
  
  try {
    // findByCredentials is a custom class method defined in User model
    const user = await User.findByCredentials(req.body.email, req.body.password)

    // generateAuthToken is a custom instance method defined in User model
    const token = await user.generateAuthToken();
    res.send({ user, token })
  } catch (err) {
    res.status(400).send()
  }
})

// PATCH request for updating a user
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  // Code to determine if update body has valid attributes/values
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const user = await User.findById(req.params.id);

    updates.forEach((update) => user[update] = req.body[update])

    await user.save()

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

// DELETE request for removing user 
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.send(404).send()
    }

    res.send(user)
  } catch (err) {
    return res.status(500).send()
  }
})

module.exports = router