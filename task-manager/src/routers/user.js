const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const multer = require('multer');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');
const router = new express.Router;

// Multer library for file uploads
const upload = multer({
  limits: {
    fileSize: 1000000
  }, 
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return callback(new Error('Please upload an image'))
    } 

    callback(undefined, true)
  }
})

// GET request for my profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// GET request for fetching user avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    // sets and sends binary data response as png image
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (err) {
    res.status(400).send()
  }
})

// POST request for creating a new User
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
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

// POST request for uploading avatar photo
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // sharp used to resize file and convert to png format
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
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
    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (err) {
    return res.status(500).send()
  }
})

// DELETE request for removing user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
  } catch (err) {
    return res.status(500).send()
  }
})

module.exports = router