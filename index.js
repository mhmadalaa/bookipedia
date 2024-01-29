const app = require('./src/app');

app.get('/', (req, res) => {
    // This code will be executed when a GET request is made to the base URL
    res.send('welcome to bookipedia app');
  });

app.listen(3000, () => {
    console.log('server is running on port 3000...')
});

// Allow Vercel to turn Express into a serverless function
module.exports = app;