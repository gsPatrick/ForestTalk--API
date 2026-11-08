const { ok } = require('../../utils/respond');
const { checkHealth } = require('./health.service');
const catchAsync = require('../../utils/catch-async');

const ping = catchAsync(async (_req, res) => ok(res, await checkHealth()));

module.exports = { ping };
