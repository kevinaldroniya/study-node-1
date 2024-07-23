const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const roleRoutes = require('./routes/roleRoute');
const bodyParser = require('body-parser');
const baseApi = '/api/v1'

app.use(bodyParser.json());
app.use(baseApi, userRoutes);
app.use(baseApi, authRoutes);
app.use(baseApi, roleRoutes);

module.exports = app;