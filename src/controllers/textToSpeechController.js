require('dotenv').config();
const axios = require('axios');

const catchAsync = require('./../utils/catchAsync');

const AI_API = process.env.AI_API;

exports.textToSpeech = catchAsync(async (req, res) => {
  const dataToSend = {
    text: req.body.text,
  };

  axios
    .get(`${AI_API}/tts`, {
      data: dataToSend,
      responseType: 'stream',
    })
    .then((response) => {
      // Set the appropriate headers for the response
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Disposition', 'attachment; filename=speech.wav');

      // Pipe the audio stream to the response
      response.data.pipe(res);
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Error occured while applying text to speech',
      });
    });
});
