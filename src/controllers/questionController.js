const catchAsync = require('../utils/catchAsync');
const questionFiltering = require('../utils/questionFiltering');
const Question = require('./../models/questionModel');

exports.SendQuestion = catchAsync(async (req, res) => {
  /*
  TODO: 
  1. send question to AI
  2. stream the response to client
  3. save the result to Question model
  */
 
  const question = await Question.create(questionFiltering(req.body));

  res.status(202).json({
    message: 'success question sent',
    Question: question,
  });
});
