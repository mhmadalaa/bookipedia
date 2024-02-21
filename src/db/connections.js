const mongoose = require('mongoose');

const makeNewConnection = (uri, databaseName) => {
  const db = mongoose.createConnection(uri);
  db.on('error', (err) => {
    console.log(err);
    db.close().catch((err) => console.log('Failed to close'));
  });
  db.on('connected', () => {
    console.log(`Connected to ${databaseName} `);
  });
  db.on('disconnected', () => {
    console.log(`Disconnected to ${databaseName} `);
  });

  return db;
};

const bookipediaConnection = makeNewConnection(
  process.env.DATABASE,
  'database',
);

module.exports = { bookipediaConnection };
