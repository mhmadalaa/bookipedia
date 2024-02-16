const mongoose = require('mongoose');
const {bookipediaConnection} = require('./../connections');

const CoverImageSchema = new mongoose.Schema({
  imageName :{
    type :String
  } ,
  imageBuffer :{
    type :Buffer 
  }
});

const CoverImageModel = bookipediaConnection.model('Cover-Image',CoverImageSchema);

module.exports = CoverImageModel;