const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const { getProfile } = require('./profile.service');

const profile = catchAsync(async (req, res) => ok(res, await getProfile(req.device.id, req.valid.params.code)));

module.exports = { profile };
