const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const service = require('./power-ups.service');

const get = catchAsync(async (req, res) => ok(res, await service.getPowerUps(req.device.id)));
const consume = catchAsync(async (req, res) => ok(res, await service.consume(req.device.id, req.valid.body.type)));

const grant = catchAsync(async (req, res) => ok(res, await service.grant(req.device.id, req.valid.body)));

module.exports = { get, consume, grant };
