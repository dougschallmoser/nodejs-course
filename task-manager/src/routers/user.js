const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router;

// GET request for my profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
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

// POST request for logging out of single token
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((elem) => elem.token !== req.token)
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

// POST request for logging out of ALL tokens
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

// PATCH request for updating a user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  // Code to determine if update body has valid attributes/values
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (err) {
    res.status(400).send(err)
  }
})

// DELETE request for removing user 
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (err) {
    return res.status(500).send()
  }
})

module.exports = router