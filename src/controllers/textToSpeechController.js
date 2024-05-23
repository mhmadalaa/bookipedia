require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const catchAsync = require('./../utils/catchAsync');

const AI_API = process.env.AI_API;

exports.textToSpeech = catchAsync(async (req, res) => {
  const dataToSend = {
    text: req.body.text,
  };

  try {
    const audioPath = path.join(__dirname, '../public', 'synthesize_audio_from_text.raw'); // Adjust path to 'test.raw' in the 'public' directory

    console.log('Checking file...');
    const stat = fs.statSync(audioPath);
    console.log('File exists, streaming audio...');

    res.writeHead(200, {
      'Content-Type': 'audio/wav', // Set the appropriate MIME type for the raw audio
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(audioPath);
    readStream.pipe(res);
  } catch (error) {
    res.status(404).json({
      message: 'Error occured while applying text to speech',
    });
  }
});
