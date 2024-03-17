const mongoose = require('mongoose');
const slugify = require('slugify');
// const {bookipediaConnection} = require('./../db/connections');

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
  chapters :{
    type: Number,
    required:[true, 'You must provide the number of chapters'] ,
  },
  slug: String ,
  category :{
    type :String , 
    required :[true , 'You should provide the category']
  },
  description :{
    type:String ,
    required :[true , 'You should provide the description']
  },
  file_id : {
    type: mongoose.Schema.ObjectId,
  },
  image_url  :String ,
  impage_name :String
});

BookSchema.pre('save' ,function(next) {
  try {
    this.slug = this.isModified('title') ? slugify(this.title , {lower :true}) : this.slug;
    this.category = this.isModified('category') ? this.category.toLowerCase() : this.category;
    next();
  }
  catch (err) {
    next(err);
  }
});

BookSchema.pre('updateOne',function(next) {
  try {
    if (this._update.title) {
      this._update.slug = slugify(this._update.title , {lower :true});
    }
    if (this._update.category) {
      this._update.category = this._update.category.toLowerCase();
    }
    next();
  }
  catch (err) {
    next(err);
  }
});

 
// const BookModel = bookipediaConnection.model('Book', BookSchema);
const BookModel = mongoose.model('Book', BookSchema);


module.exports = BookModel;