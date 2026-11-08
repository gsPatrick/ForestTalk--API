const catchAsync = require('../../utils/catch-async');
const { CONTENT_TYPE } = require('../../providers/elevenlabs/elevenlabs.config');
const service = require('./speech.service');

const speak = catchAsync(async (req, res) => {
  const audio = await service.speak(req.valid.body);
  res.status(200).set({ 'Content-Type': CONTENT_TYPE, 'Content-Length': audio.length, 'Cache-Control': 'private, max-age=86400' }).send(audio);
});

module.exports = { speak };
