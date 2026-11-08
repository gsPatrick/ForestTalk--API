const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const service = require('./shop.service');

const items = catchAsync(async (_req, res) => ok(res, service.listItems()));
const buy = catchAsync(async (req, res) => ok(res, await service.buy(req.device.id, req.valid.params.id)));

module.exports = { items, buy };
