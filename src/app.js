const express = require('express');
const morgan = require('morgan');
const path = require('path');

const auth = require('./routers/auth');
const bookRouter = require('./routers/bookRoute');
const aiRouter = require('./routers/aiRoute');
const documentRouter = require('./routers/documentRoute');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Serve static files from `public` dir without routing
app.use(express.static(path.join(__dirname, './public')));

app.use(
  express.urlencoded({
    extended: false,
  }),
);

// APP ROUTERS
app.use('/document', documentRouter);
app.use('/book', bookRouter);
app.use('/auth', auth);
app.use('/ai', aiRouter);

// NOT FOUND ROUTERS ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
