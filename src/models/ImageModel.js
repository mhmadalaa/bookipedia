const mongoose = require('mongoose');
// const {bookipediaConnection} = require('./../db/connections');

const CoverImageSchema = new mongoose.Schema({
  imageName :{
    type :String
  } ,
  imageBuffer :{
    type :Buffer 
  }
});

// const CoverImageModel = bookipediaConnection.model('Cover-Image',CoverImageSchema);
const CoverImageModel = mongoose.model('Cover-Image',CoverImageSchema);

module.exports = CoverImageModel;