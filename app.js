const express = require('express');
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
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
