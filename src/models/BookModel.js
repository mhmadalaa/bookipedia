const mongoose = require('mongoose');
const slugify = require('slugify');
const {BookepidiaConnection} = require('./../connections'); 


const bookSchema = new mongoose.Schema({
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
    require:[true, 'You must provide the size'] ,
    min :[1 , 'The minimum size is 1 Kb']

  },
  chapters :{
    type: Number,
    require:[true, 'You must provide the number of chapters'] ,
  },
  slug: String ,
  file_id : {
    type : mongoose.Schema.ObjectId  ,
    ref :'Fs.file'
  }
});

bookSchema.pre('save' ,function(next) {
  this.slug = slugify(this.title , {lower :true});
  next();
});

const BookModel = BookepidiaConnection.model('Book', bookSchema);
/* console.log(mongoose.models); */


module.exports = BookModel;