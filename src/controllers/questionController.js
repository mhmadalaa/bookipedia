const { pipeline } = require('node:stream/promises');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const openai = require('./../config/openaiConfig');

const questionFiltering = (body) => {
  return {
    question: body.question,
    answer: body.answer,
    document: body.document,
    book: body.book,
    user: body.user,
  };
};

exports.askQuestion = catchAsync(async (req, res) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: req.body.question }],
    model: 'gpt-3.5-turbo',
    // stream: true,
  });

  if (chatCompletion) {
    req.body.answer = chatCompletion.choices[0]?.message?.content || '';
    await Question.create(questionFiltering(req.body));
  }

  await pipeline(chatCompletion.choices[0].message.content, res);
});

exports.reteriveBookChat = catchAsync(async (req, res) => {
  // FIXME: we will now the requsested user from the pre authenticate middleware
  //        so we will assume it right now
  const user = '65b94e71032474cb3d01f55f';

  const questions = await Question.find({
    book: req.params.book_id,
    user: user,
    createdAt: { $lte: req.query.createdOnBefore || Date.now() },
  })
    .limit(req.query.limit || 10)
    .select('-__v')
    .sort('-createdOn');

  res.status(200).json({
    message: 'success',
    data: questions,
  });
});

exports.reteriveDocumentChat = catchAsync(async (req, res) => {
  // FIXME: we will now the requsested user from the pre authenticate middleware
  //        so we will assume it right now
  const user = '65bbfbe7e2e2d8a99ae79cd6';

  const questions = await Question.find({
    document: req.params.document_id,
    user: user,
    createdAt: { $lte: req.query.createdOnBefore || Date.now() },
  })
    .limit(req.query.limit || 10)
    .select('-__v')
    .sort('-createdOn');

  res.status(200).json({
    message: 'success',
    data: questions,
  });
});
