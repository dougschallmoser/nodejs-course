// supertest library used for testing requests
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { userOneId, userOne, userTwo, populateDatabase } = require('./fixtures/db');

beforeEach(populateDatabase)

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Sam',
      email: 'sam@gmail.com',
      password: 'MyPass777!'
    })
    .expect(201)

  // Assert that the user was saved to database
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Sam',
      email: 'sam@gmail.com'
    },
    token: user.tokens[0].token
  })

  // Assert database password is not plain text password
  expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)

  // Assert current token is user's second token
  const user = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login a non-existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'notCorrectPassword9!'
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  // Asserts user is not found in database
  const user = await User.findById(response.body.user)
  expect(user).toBeNull()
})

test('Should not delete account for unathenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  const response = await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile.jpg')
    .expect(200)

  // Check if user's avatar is a Buffer
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Ava'
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Ava')
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Bellingham'
    })
    .expect(400)
})