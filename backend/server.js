
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');


connectDB();


const app = express();

app.use(helmet());


app.use(cors());


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Food Ordering API is running...');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurant'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/payments', require('./routes/payment'));


const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});