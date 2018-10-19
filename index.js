const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const Task = require('./modules/task/taskModule');

// ===== DATABASE ======
const MONGO_ATLAS_USER = 'editor';
const MONGO_ATLAS_PWD = 'dJ8teLqaB5JVGuWV';
const MONGO_ATLAS_HOST = 'cluster0-p9gc5.mongodb.net';
const MONGO_ATLAS_DB_NAME = 'test';

const db = `mongodb+srv://${MONGO_ATLAS_USER}:${MONGO_ATLAS_PWD}@${MONGO_ATLAS_HOST}/${MONGO_ATLAS_DB_NAME}?retryWrites=false`;
mongoose.connect(db);

mongoose.connection.on('error', () => {
  throw new Error('Unable to connect to database');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// ===== PARSE RESPONSE =====
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

app.get('/hi', (req, res) => res.status(200).json({ get: 2056 }));
app.post('/hi', (req, res) => res.status(200).json({ post: 256 }));
app.delete('/hi', (req, res) => res.status(200).json({ delete: 2065 }));
app.patch('/hi', (req, res) => res.status(200).json({ patch: 2506 }));
app.post('/calculator', calculator);

app.post('/note', noteCreate);
app.get('/note', noteGetAll);
app.delete('/note/:taskId', noteDelById);

function calculator(req, res) {
  console.log(req.body.a);
  if (req.body.operation === 'add') {
    res.status(200).json({ result: req.body.a + req.body.b });
  } else if (req.body.operation === 'minus') {
    res.status(200).json({ result: req.body.a - req.body.b });
  } else if (req.body.operation === 'multiply') {
    res.status(200).json({ result: req.body.a * req.body.b });
  } else if (req.body.operation === 'divide') {
    res.status(200).json({ result: req.body.a / req.body.b });
  } else {
    res.status(200).json({ result: 'Operation is not defined' });
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('ok'));

function noteCreate(req, res) {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
  });
  task
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created task successfully",
        createdTask: {
          title: result.title,
          description: result.description,
          _id: result._id,

        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

function noteGetAll(req, res) {
  Task.find()
    .select('-__v')
    .exec()
    .then((docs) => {
      res.status(200)
        .json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500)
        .json(err);
    });
}

function noteDelById(req, res) {
  const id = req.params.taskId;
  Task.remove({ _id: id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200)
          .json('Task deleted');
      } else {
        res.status(400)
          .json('Task not found');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500)
        .json(err);
    });
}
//Hello, I am a comment
