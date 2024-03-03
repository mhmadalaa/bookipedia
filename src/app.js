const express = require('express');
const morgan = require('morgan');

const auth = require('./routers/auth');
const booksRouter = require('./routers/booksRouter');
const aiRouter = require('./routers/aiRoute');
const documentRouter = require('./routers/documentRotue');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

// APP ROUTERS
app.use('/document', documentRouter);
app.use('/book', booksRouter);
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
