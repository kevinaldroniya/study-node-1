const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/users',userRoutes);

module.exports = app;