const noteModel = require('../models/noteModel');
const catchAsync = require('../utils/catchAsync');


exports.createNote = catchAsync(async (req , res , next) => {

  const note = await noteModel.create({
    type : req.query.type ,
    content : req.body.content ,
    page : req.body.page ,
    user :req.user._id ,
    createdAt :Date.now() ,
    book : req.body.book ,
    document: req.body.document
  });

  res.status(201).json({
    status : 'success' , 
    note
  });
});

exports.updateNoteContent = catchAsync(async (req, res ,next) => {

  const note = await noteModel.findByIdAndUpdate(
    {
      _id: req.params.id  ,
      user :req.user._id
    }, 
    {content :req.body.content} ,
    {new :true});
  res.status(200).json({
    status : 'success',
    note
  });
});

exports.deleteNote = catchAsync(async (req , res , next) => {

  const note = await noteModel.findByIdAndDelete({
    _id: req.params.id  ,
    user :req.user._id
  });
  res.status(204).json({
    status:'success',
    note
  });
});

