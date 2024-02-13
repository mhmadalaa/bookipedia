const mongoose = require('mongoose');
const {bookipediaConnection} = require('./../connections');
const slugify = require('slugify');


const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'You must provide a title']
  },
  author: {
    type: String,
    required: [true, 'You must provide an author name ']
  },
  pages: {
    type: Number,
    required: [true, 'You must provide the number of the book pages'],
    min: [1, 'The minimum number of pages is 1']
  },
  size :{
    type: Number,
    required:[true, 'You must provide the size'] ,
    min :[1 , 'The minimum size is 1 Kb']

  },
  chapters :{
    type: Number,
    required:[true, 'You must provide the number of chapters'] ,
  },
  slug: String ,
  file_id : {
    type :String
  }
});

BookSchema.pre('save' ,function(next) {
  this.slug = slugify(this.title , {lower :true});
  next();
});


const BookModel = bookipediaConnection.model('Book', BookSchema);


module.exports = BookModel;