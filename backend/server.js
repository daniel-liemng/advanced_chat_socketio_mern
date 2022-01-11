require('dotenv').config();

const express = require('express');

const { chats } = require('./data/data');

const app = express();

// Routes
app.get('/', (req, res) => {
  res.send('OKKK');
});

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const oneChat = chats.find((item) => item._id === req.params.id);
  console.log(oneChat);
  res.send(oneChat);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
