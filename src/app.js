const express = require('express');
const morgan = require('morgan');
const path = require('path');

const authRouter = require('./routers/authRoute');
const bookRouter = require('./routers/bookRoute');
const aiRouter = require('./routers/aiRoute');
const documentRouter = require('./routers/documentRoute');
const noteRouter = require('./routers/noteRoute');
const deployRouter = require('./routers/deployRoute');


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
app.use('/auth', authRouter);
app.use('/ai', aiRouter);
app.use('/note', noteRouter);

// deployement router managed by github-workflow
app.use('/deploy', deployRouter);

// NOT FOUND ROUTERS ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
