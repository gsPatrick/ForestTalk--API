const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const scenarios = require('./scenarios.service');
const completion = require('./completion.service');

exports.list = catchAsync(async (_req, res) => ok(res, await scenarios.listScenarios()));

exports.get = catchAsync(async (req, res) => ok(res, await scenarios.getScenario(req.valid.params.id, req.valid.query.lang)));

exports.complete = catchAsync(async (req, res) =>
  ok(res, await completion.completeScenario(req.device.id, req.valid.params.id, req.valid.body)),
);

exports.completions = catchAsync(async (req, res) => ok(res, await completion.completionsMap(req.device.id, req.valid.query.lang)));
