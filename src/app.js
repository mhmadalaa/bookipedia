const express = require('express');
const morgan = require('morgan');

const auth = require('./routers/auth');
const filesRouter = require('./routers/filesRouter');
const booksRouter = require('./routers/booksRouter');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

// APP ROUTERS`
app.use('/files', filesRouter);
app.use('/books' , booksRouter);
app.use('/auth', auth);

// NOT FOUND ROUTERS ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
