const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const AppError = require('../utils/appError');
const Book = require('../models/BookModel');
const Document = require('./../models/documentModel');
const Chat = require('./../models/chatModel');
const { pipeline } = require('node:stream/promises');
const { BufferListStream } = require('bl');
const { json } = require('express');
const AI_API = process.env.AI_API;

exports.askQuestion = catchAsync(async (req, res) => {
  // ai-request query parameters
  // const queryParams = {
  //   enable_web_retrieval: true,
  // };

  const chat = await chatAndFileId(req);

  req.chat_id = chat.chat._id;
  // const last_questions = await lastQuestions(req);

  const json_response = JSON.parse(process.env.MOCK_AI_RESPONSE);
  // console.log(json_response);

  const chat_answer = JSON.stringify(json_response.response);
  const chat_sources = JSON.stringify(json_response.sources);

  // console.log(chat_answer);

  await Question.create({
    question: req.body.question,
    answer: chat_answer,
    sources: chat_sources,
    chat_id: req.chat_id,
    user: req.user._id,
    createdAt: Date.now(),
  });

  res.send(process.env.MOCK_AI_RESPONSE);

  // const dataToSend = {
  //   user_prompt: req.body.question,
  //   chat_summary: chat.chat.chat_summary,
  //   chat: last_questions.join(', '),
  //   doc_ids: [chat.file_id.toString()],
  // };

  // const bufferStream = new BufferListStream();

  // try {
  //   axios
  //     .get(`${AI_API}/chat_response/${req.chat_id.toString()}`, {
  //       params: queryParams,
  //       data: dataToSend,
  //       responseType: 'stream',
  //     })
  //     .then(async (response) => {
  //       // accumulate the response data to a buffer list
  //       response.data.on('data', (chunk) => {
  //         // Append each chunk to the buffer
  //         bufferStream.append(Buffer.from(chunk));
  //       });

  //       // pipe the response stream to client
  //       await pipeline(response.data, res);

  //       const ai_response = bufferStream.toString();

  //       const json_response = JSON.parse(ai_response);

  //       const chat_answer = JSON.stringify(json_response.response);
  //       const chat_sources = JSON.stringify(json_response.sources);

  //       // save the question data to database
  //       await Question.create({
  //         question: req.body.question,
  //         answer: chat_answer.toString(),
  //         sources: chat_sources.toString(),
  //         chat_id: req.chat_id,
  //         user: req.user._id,
  //         createdAt: Date.now(),
  //       });
  //     });
  // } catch (error) {
  //   console.error('✗ Error while answering a chat question', error);
  //   res.status(500).json({
  //     message: '✗ Error while answering a chat question',
  //     error: error.message,
  //   });
  // }
});

exports.reteriveChat = catchAsync(async (req, res) => {
  const chat = await chatAndFileId(req);

  const questions = await Question.find({
    chat_id: chat.chat._id,
    createdAt: { $lte: req.query.createdOnBefore || Date.now() },
  })
    .limit(req.query.limit || 10)
    .select('-_id -__v -chat_id')
    .sort('-createdOn');

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

const lastQuestions = async (req) => {
  const chat = req.chat_id;

  const questions = await Question.find({
    chat_id: chat,
    createdAt: { $lte: Date.now() },
  })
    .limit(5)
    .select('-__v -_id -chat_id -createdAt -sources')
    .sort('-createdOn');

  return questions;
};

const chatAndFileId = async (req) => {
  let file_id, chat;
  if (req.query.type === 'book') {
    const book = await Book.findById(req.params.id);
    file_id = book.file_id;

    chat = await Chat.findOne({
      book: req.params.id,
      user: req.user._id,
    });

    // chat = null meaning that it's the first question in the chat
    // and there is no chat with these data
    if (chat === null) {
      chat = await Chat.create({
        chat_summary: 'none',
        book: book._id,
        user: req.user._id,
        createdAt: Date.now(),
      });
    }
  }
  if (req.query.type === 'document') {
    const document = await Document.findById(req.params.id);
    file_id = document.file_id;

    chat = await Chat.findOne({
      document: req.params.id,
      user: req.user._id,
    });

    // chat = null meaning that it's the first question in the chat
    // and there is no chat with these data
    if (chat === null) {
      chat = await Chat.create({
        chat_summary: 'none',
        document: document._id,
        user: req.user._id,
        createdAt: Date.now(),
      });
    }
  }

  return { file_id: file_id, chat: chat };
};
