require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
require('./src/models/BookModel');


//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
});


mongoose.connect(process.env.DATABASE).then(() => console.log('Connected to database')).catch((err) => console.log(err));


/* console.log(GridfsConnection.collections['fs.files']) */

app.get('/', (req, res) => {
  // This code will be executed when a GET request is made to the base URL
  res.send('welcome to bookipedia app');
});

// START SERVER
app.listen(3000, () => {
  console.log(`server is running on port ${process.env.PORT}...`);
});