const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useUnifiedTopology: true}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database')
  }

  //connects to database
  const db = client.db(databaseName);

  // CREATE ONE DOCUMENT
  // db.collection('users').insertOne({
  //   name: 'Vickram',
  //   age: 26 
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   }

  //   console.log(result.ops)
  // })

  // CREATE MULTIPLE DOCUMENTS
  // db.collection('users').insertMany([
  //   {
  //     name: 'Erin',
  //     age: 35
  //   }, {
  //     name: 'Finch',
  //     age: 1
  //   }
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert documents')
  //   }

  //   console.log(result.ops)
  // })

  // READ SINGLE DOCUMENT
  // db.collection('tasks').findOne( { _id: ObjectID('6005c964826297115a592fd4') }, (error, task) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(task)
  // })

  // READ MULTIPLE DOCUMENTS
  // db.collection('tasks').find( {completed: false }).toArray((error, tasks) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(tasks)
  // })

  // READ COUNT
  // db.collection('users').find( {age: 33} ).count((error, count) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(count)
  // })

  // UPDATE SINGLE DOCUMENT
  // db.collection('users').updateOne({
  //   _id: ObjectID('6005c65d9e3d830ff990825c')
  // }, {
  //   $set: {
  //     name: 'Mike'
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // UPDATE AND INCREMENT SINGLE DOCUMENT
  // db.collection('users').updateOne({
  //   _id: ObjectID('6005c65d9e3d830ff990825c')
  // }, {
  //   $inc: {
  //     age: 1
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // UPDATE MANY DOCUMENTS
  // db.collection('tasks').updateMany({
  //   completed: false
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // DELETE ONE DOCUMENT
  // db.collection('tasks').deleteOne({
  //   description: 'Laundry'
  // }).then((result) => {
  //   console.log(result)
  // }).then((error) => {
  //   console.log(error)
  // })

  // DELETE MANY DOCUMENTS
  // db.collection('users').deleteMany({
  //   age: 34
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

})