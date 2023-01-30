const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

// init and middleware
const app = express();

let db; 

// dbconnection 
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
