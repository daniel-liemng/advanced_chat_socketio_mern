require('dotenv').config();

const express = require('express');
const colors = require('colors');

const connectDB = require('./config/db');
const { chats } = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

connectDB();

const app = express();

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API Route Running Successfully');
});

app.use('/api/user', userRoutes);

// 2 Error handler middlewares at last
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`.yellow.bold);
});
