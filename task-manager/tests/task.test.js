const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const { userOne, taskThree, populateDatabase } = require('./fixtures/db');

beforeEach(populateDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Give bath to dog',
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('Should fetch user specific tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  
  expect(response.body.length).toEqual(2)
})

test('Should not allow one user to delete another users task', async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
})