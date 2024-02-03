const mongoose = require('mongoose');
const slugify = require('slugify');  

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
  slug: String
  /* file_id : {
    type : mongoose.Schema.ObjectId  ,
    ref :'fs.files'
  } */
  /*   file_id: {
    type : String,
    required :[true ,'You must provide the file id']
  } */

});

bookSchema.pre('save' ,function(next) {
  this.slug = slugify(this.title , {lower :true});
  next();
});

const BookModel = mongoose.model('Book', bookSchema);


const main = async () => {
  try {
  /* const Book = await BookModel.create ({
    title :'Js Book' ,
    author :'John' ,
    pages:15 ,
    size :100 ,
    chapters:2,
    file_id:'65b9456f2d3142a70a28483a'
  }); */
    const Book = await BookModel.find();
    console.log(Book);
  }
  catch (err) {
    console.log(err);
  }
};

main();


module.exports = BookModel;