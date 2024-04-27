const { pipeline } = require('node:stream/promises');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const openai = require('./../config/openaiConfig');
const AppError = require('../utils/appError');
const axios = require('axios');
const Book = require('../models/BookModel');
const Document = require('./../models/documentModel');
const AI_API = process.env.AI_API;

/*
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
*/

exports.askQuestion = catchAsync(async (req, res) => {
  /* openai api */
  /*
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
  */

  /* our ai api */
  /*
    user_prompt = the user question from req.body.question
    chat = the last 5 questions form question model
    doc_ids = the user question asked on

    chat_id = we will add chat model, contains chat summary and chat_id
    chat_summary = from chat model 
  */

  // request query parameters
  const queryParams = {
    enable_web_retrieval: true,
  };

  // request body
  let ocr, file_id;
  if (req.query.type === 'book') {
    const book = await Book.findById(req.params.id);
    file_id = book.file_id;
  }
  if (req.query.type === 'document') {
    const document = await Document.findById(req.params.id);
    file_id = document.file_id;
  }

  const chat = fileChat(req);

  // const chat_summary = // from chat model

  const dataToSend = {
    user_prompt: req.body.question,
    chat_summary:
      'Nikola Tesla was a Serbian-American inventor, electrical engineer, and futurist. He is known for his contributions.',
    chat: chat,
    doc_ids: [file_id],
    ocr: ocr,
  };

  const chat_id = '657ca6946a4b116e10326793'; // make chat model contains chat summary
  console.log(AI_API);

  // Axios GET request with query parameters and request body
  axios
    .get(`${AI_API}/chat_response/${chat_id}`, {
      params: queryParams,
      data: dataToSend,
    })
    .then((response) => {
      // console.log('Response:', response.data);

      // await Question.create(); // save the question

      res.status(200).json({
        message: 'success',
        data: response.data,
      });
    })
    .catch((error) => {
      // console.error('Error:', error.message);

      res.status(404).json({
        message: 'fail to connect to ai api',
        error: error.message,
      });
    });
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

const fileChat = catchAsync(async (req) => {
  const user = req.user._id;

  const book = req.query.type === 'book';
  const document = req.query.type === 'document';

  let questions;

  if (book) {
    questions = await Question.find({
      book: req.params.id,
      user: user,
      createdAt: { $lte: Date.now() },
    })
      .limit(5)
      .select('-__v -_id -book -user -createdAt')
      .sort('-createdOn');
  } else if (document) {
    questions = await Question.find({
      document: req.params.id,
      user: user,
      createdAt: { $lte: Date.now() },
    })
      .limit(5)
      .select('-__v -_id -document -user -createdAt')
      .sort('-createdOn');
  }

  return questions;
});
