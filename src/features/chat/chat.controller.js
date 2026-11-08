const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const chat = require('./chat.service');

exports.characters = (_req, res) => ok(res, chat.listCharacters());

exports.start = catchAsync(async (req, res) => {
  const { characterId, languageCode } = req.valid.body;
  ok(res, await chat.start(req.device.id, characterId, languageCode));
});

exports.suggestions = (req, res) => ok(res, chat.suggestions(req.valid.query.lang, req.valid.query.turn));

exports.send = catchAsync(async (req, res) => ok(res, await chat.send(req.device.id, req.valid.body)));
