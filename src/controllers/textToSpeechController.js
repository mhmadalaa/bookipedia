require('dotenv').config();
const stream = require('stream');
const axios = require('axios');

const openai = require('./../config/openaiConfig');
const catchAsync = require('./../utils/catchAsync');

const AI_API = process.env.AI_API;

exports.textToSpeech = catchAsync(async (req, res) => {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: req.body.text,
  });

  const dataToSend = {
    text: 'The dominant sequence transduction models',
  };

  axios
    .get(`${AI_API}/tts`, {
      data: dataToSend,
    })
    .then((response) => {
      // Handle success
      console.log('Response:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Error:', error.message);
    });

  // Set the appropriate headers for the response
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'attachment; filename=speech.mp3');

  // Convert the base64 audio content to a Buffer
  const buffer = Buffer.from(await response.arrayBuffer());

  // Create a readable stream from the buffer
  const audioStream = new stream.PassThrough();
  audioStream.end(buffer);

  // Pipe the audio stream to the response
  audioStream.pipe(res);
});
