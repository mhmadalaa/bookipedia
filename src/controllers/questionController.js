const { pipeline } = require('node:stream/promises');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const openai = require('./../config/openaiConfig');
const AppError = require('../utils/appError');

const questionFiltering = (req) => {
  const user = req.user._id;

  return {
    question: req.body.question,
    answer: req.body.answer,
    document: req.body.document,
    book: req.body.book,
    user: user,
    createdAt: Date.now(),
  };
};

exports.askQuestion = catchAsync(async (req, res) => {
  if (req.query.type === 'book') req.body.book = req.params.id;
  if (req.query.type === 'document') req.body.document = req.params.id;

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: req.body.question }],
    model: 'gpt-3.5-turbo',
    // stream: true,
  });

  if (chatCompletion) {
    req.body.answer = chatCompletion.choices[0]?.message?.content || '';
    await Question.create(questionFiltering(req));
  }

  await pipeline(chatCompletion.choices[0].message.content, res);
});

exports.reteriveChat = catchAsync(async (req, res) => {
  const user = req.user._id;

  const book = req.query.type === 'book';
  const document = req.query.type === 'document';

  let questions;

  if (book) {
    questions = await Question.find({
      book: req.params.id,
      user: user,
      createdAt: { $lte: req.query.createdOnBefore || Date.now() },
    })
      .limit(req.query.limit || 10)
      .select('-__v')
      .sort('-createdOn');
  } else if (document) {
    questions = await Question.find({
      document: req.params.id,
      user: user,
      createdAt: { $lte: req.query.createdOnBefore || Date.now() },
    })
      .limit(req.query.limit || 10)
      .select('-__v')
      .sort('-createdOn');
  }

  res.status(200).json({
    message: 'success',
    data: questions,
  });
});

exports.enforceQueryParams = (req, res, next) => {
  if (
    req.query &&
    (req.query.type === 'book' || req.query.type === 'document')
  ) {
    return next();
  }

  return next(
    new AppError(
      'Missing required query parameters, it should be in the form ?type=book or ?type=document',
      400,
    ),
  );
};
