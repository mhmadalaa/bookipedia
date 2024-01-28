const express = require('express');
const auth = require('./routers/auth');
const app = express();
app.use(express.json());
app.use('/auth', auth)

module.exports = app;
