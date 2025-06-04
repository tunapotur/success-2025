const path = require('path');
const express = require('express');
const morgan = require('morgan');
const testRouter = require('./routes/testRoutes');

const app = express();

// Test middleware
// Those routers contain controllers to check user requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', testRouter);

module.exports = app;
