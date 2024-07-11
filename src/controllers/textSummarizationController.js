const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const Question = require('./../models/questionModel');
const AppError = require('../utils/appError');
const Book = require('../models/BookModel');
const Document = require('./../models/documentModel');
const Chat = require('./../models/chatModel');
const { pipeline } = require('node:stream/promises');
const { BufferListStream } = require('bl');
const AI_API = process.env.AI_API;

exports.summarizeQuestion = catchAsync(async (req, res) => {
  const file = await chatAndFileId(req);

  req.chat_id = file.chat._id;

  const dataToSend = {
    start_page: parseInt(req.query.start_page),
    end_page: parseInt(req.query.end_page),
  };

  const bufferStream = new BufferListStream();

  axios
    .get(`${AI_API}/summarize_pages/${file.file_id.toString()}`, {
      data: dataToSend,
      responseType: 'stream',
    })
    .then(async (response) => {
      // accumulate the response data to a buffer list
      response.data.on('data', (chunk) => {
        // Append each chunk to the buffer
        bufferStream.append(Buffer.from(chunk));
      });

      // pipe the response stream to client
      await pipeline(response.data, res);

      try {
        const chat_answer = bufferStream.toString();

        // save the question data to database
        await Question.create({
          question: req.body.question,
          answer: chat_answer,
          chat_id: req.chat_id,
          user: req.user._id,
          createdAt: Date.now(),
        });

        // Increment the book recommendation factor by 0.1
        await Book.findByIdAndUpdate(
          req.params.id,
          { $inc: { recommendation: 0.1 } },
          { new: true },
        );
      } catch (error) {
        console.error(
          '✗ can not save [page text summarization] in chat answer to database',
          error,
        );
      }
    })
    .catch(function (error) {
      res.status(500).json({
        message:
          'can not connect to ai-api to answer [page text summarization] in chat question',
      });
    });
});

exports.enforceQueryParams = (req, res, next) => {
  if (
    req.query &&
    (req.query.type === 'book' || req.query.type === 'document') &&
    req.query.start_page &&
    req.query.end_page
  ) {
    return next();
  }

  return next(
    new AppError(
      'Missing required query parameters, it should be in the form ?type=book or ?type=document and &req.qurey.start_page &req.query.end_page',
      400,
    ),
  );
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
