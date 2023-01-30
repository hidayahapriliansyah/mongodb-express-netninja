const express = require('express');

// init and middleware
const app = express();

app.listen(3000, () => {
  console.log('app listening on port 3000');
});

// routes
app.get('/books', (req, res) => {
  res.json({ message: 'Welcome to the api' });
});
