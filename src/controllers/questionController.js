const { pipeline } = require('node:stream/promises');
const catchAsync = require('../utils/catchAsync');
const questionFiltering = require('../utils/questionFiltering');
const Question = require('./../models/questionModel');
const openai = require('./../config/openaiConfig');

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
