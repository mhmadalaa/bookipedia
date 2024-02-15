const express = require('express');
require('dotenv').config(); // TODO: remove this line



/*
const router = express();

router.get('/', (req, res) => {
    res.send('authentication route');
  });


module.exports = router;
*/


// Replace the uri string with your connection string.

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.DATABASE;

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('<db>');
    const users = database.collection('users');

    // Query for a movie that has the title 'Back to the Future'
    const query = { username: 'lilhind' };
    const user = await users.findOne(query);

    console.log(user);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);