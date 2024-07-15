const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes)

module.exports = app;