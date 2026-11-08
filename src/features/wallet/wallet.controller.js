const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const service = require('./wallet.service');

const get = catchAsync(async (req, res) => ok(res, await service.getWallet(req.device.id)));
const spend = catchAsync(async (req, res) => ok(res, await service.spend(req.device.id, req.valid.body.amount)));

const earn = catchAsync(async (req, res) => ok(res, await service.earn(req.device.id, req.valid.body.amount)));

module.exports = { get, spend, earn };
