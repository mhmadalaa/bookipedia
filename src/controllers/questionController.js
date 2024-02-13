const { pipeline } = require('node:stream/promises');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const openai = require('./../config/openaiConfig');

const questionFiltering = (req) => {
  // FIXME: we will now the requsested user from the pre authenticate middleware
  //        so we will assume it right now
  const user = '65bac7fc9e0596718c2769ce';

  return {
    question: req.body.question,
    answer: req.body.answer,
    document: req.body.document,
    book: req.body.book,
    user: user,
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
    await Question.create(questionFiltering(req));
  }

  await pipeline(chatCompletion.choices[0].message.content, res);
});

exports.reteriveChat = catchAsync(async (req, res) => {
  // FIXME: we will now the requsested user from the pre authenticate middleware
  //        so we will assume it right now
  const user = '65bac7fc9e0596718c2769ce';

  const questions = await Question.find({
    $or: [{ book: req.params.id }, { document: req.params.id }],
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
