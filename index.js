const mongoose = require('mongoose');
const app = require('./src/app');

//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
});

// CONNECT TO DATABASE
const url = process.env.DATABASE;
mongoose
  .connect(url)
  .then((con) => {
    console.log('DB connecting successful...');
  })
  .catch((err) => {
    console.log('DB connection ERROR!!');
    console.log(err);
  });

app.get('/', (req, res) => {
  // This code will be executed when a GET request is made to the base URL
  res.send('welcome to bookipedia app');
});

// START SERVER
app.listen(3000, () => {
  console.log('server is running on port 3000...');
});

// Allow Vercel to turn Express into a serverless function
module.exports = app;
