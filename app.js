const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

// init and middleware
const app = express();

app.use(express.json());


// dbconnection 
let db; 

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('app listening on http://localhost:3000');
    });
    db = getDb();
  }
});

// routes
app.get('/books', (req, res) => {
  let books = [];

  db.collection('books')
    .find() // find itu mereturn cursor, 
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json({
        status: 'succes',
        books: books,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        if (!doc) {
          res.status(400).json({ error: 'Could find document. Bad request.' });
          return;
        }
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not find the document' });
      })
  } else {
    res.status(500).json({ error: 'Not valid id' });
  }
});

app.post('/books', (req, res) => {
  const book = req.body;

  db.collection('books')
    .insertOne(book)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Could not insert book'});
    });
});

app.delete('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not delete the document' });
      })
  } else {
    res.status(500).json({ error: 'Not valid id' });
  }
});

app.patch('/books/:id', (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .updateOne({ _id: ObjectId(req.params.id) }, { $set : updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not update the document' });
      })
  } else {
    res.status(500).json({ error: 'Not valid id' });
  }
});