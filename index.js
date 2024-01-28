const app = require('./src/app');


app.listen(3000, () => {
    console.log('server is running on port 3000...')
});

// Allow Vercel to turn Express into a serverless function
module.exports = app;