require('dotenv').config();
const mongoose = require('mongoose');
// const { bookipediaConnection } = require('./src/db/connections');
const app = require('./src/app');

//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('✗ unhandledRejection', error.message);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('↪ connected to database ✔');
  })
  .catch((err) => console.log('✗ ', err));

app.get('/', (req, res) => {
  // This code will be executed when a GET request is made to the base URL
  res.send('welcome to bookipedia app');
});

// START SERVER
app.listen(process.env.PORT | 3000, () => {
  console.log(`↪ server is running on port ${process.env.PORT | 3000} 🚀`);
});
