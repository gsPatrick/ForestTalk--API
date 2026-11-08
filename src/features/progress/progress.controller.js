const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const { getChapters } = require('./chapters.service');
const { getProgress } = require('./progress-state.service');
const { completePhase } = require('./complete-phase.service');
const { openChest } = require('./open-chest.service');

const chapters = catchAsync(async (req, res) => ok(res, await getChapters(req.device.id, req.valid.params.code)));
const progress = catchAsync(async (req, res) => ok(res, await getProgress(req.device.id, req.valid.params.code)));
const complete = catchAsync(async (req, res) => {
  const { code, n } = req.valid.params;
  ok(res, await completePhase(req.device.id, code, n, req.valid.body));
});
const chest = catchAsync(async (req, res) => {
  const { code, after } = req.valid.params;
  ok(res, await openChest(req.device.id, code, after, req.valid.body.coins));
});

module.exports = { chapters, progress, complete, chest };
