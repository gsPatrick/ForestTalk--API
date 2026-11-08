const catchAsync = require('../../utils/catch-async');
const { created, ok } = require('../../utils/respond');
const { registerDevice } = require('./device-register.service');
const { getDevice } = require('./device-profile.service');

const register = catchAsync(async (req, res) => created(res, await registerDevice(req.valid.body)));
const me = catchAsync(async (req, res) => ok(res, await getDevice(req.device.id)));

module.exports = { register, me };
