const express = require('express');




const auth = require('./src/routers/auth');


const app = express();
app.use(express.json());
app.use('/auth', auth)
app.listen(3000, () => {
    console.log('server is running on port 3000...')
});

// Allow Vercel to turn Express into a serverless function
module.exports = app;