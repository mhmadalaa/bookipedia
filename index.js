require('dotenv').config();
const {BookepidiaConnection ,GridfsConnection} = require('./src/connections.js');
const app = require('./src/app');


//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
});



app.get('/', (req, res) => {
  // This code will be executed when a GET request is made to the base URL
  res.send('welcome to bookipedia app');
});

// START SERVER
app.listen(3000, () => {
  console.log(`server is running on port ${process.env.PORT}...`);
});


