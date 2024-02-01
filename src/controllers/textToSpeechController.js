const stream = require('stream');

const openai = require('./../config/openaiConfig');

exports.textToSpeech = async (req, res) => {
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: req.body.text,
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
  } catch (err) {
    // console.error('Error fetching TTS response:', err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
