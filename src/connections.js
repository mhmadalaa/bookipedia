const mongoose = require('mongoose');


const makeNewConnection = (uri, databaseName) => {
  const db = mongoose.createConnection(uri);
  db.on('error', (err) => {
    console.log(err);
    db.close().catch((err) => console.log('Failed to close'));
  });
  db.on('connected', () => { console.log(`Connected to ${databaseName} `); });
  db.on('disconnected', () => { console.log(`Disconnected to ${databaseName} `); });

  return db;

};

const BookepidiaConnection = makeNewConnection(process.env.BOOKEPDIA_URI , 'Bookepidia Database');
const GridfsConnection = makeNewConnection(process.env.GRIDFS_URI , 'Gridfs Database');

module.exports = {
  BookepidiaConnection ,
  GridfsConnection
};