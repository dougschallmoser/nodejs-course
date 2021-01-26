const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }, 
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain 'password'")
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// For implementing associations between models 
// (Tasks doesn't actually live on the User model)
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// Custom instance method for generating JSON Web Token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisisfun');

  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

// Instance method to expose particular key/value pairs
// when sending back responses (hide user password, avatar, tokens)
// "toJSON" is a built in instance method
userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject()

  delete userObj.password
  delete userObj.tokens
  delete userObj.avatar

  return userObj
}

// Custom class method on model for validating user login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// Hashes password before User is saved
userSchema.pre('save', async function(next) {
  const user = this;

  // if password is being changed, set password to hashed password
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// Delete all user's tasks when user is deleted
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;