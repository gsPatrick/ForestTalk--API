const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const service = require('./shop.service');
const coinPacksService = require('./coin-packs.service');

const items = catchAsync(async (_req, res) => ok(res, service.listItems()));
const buy = catchAsync(async (req, res) => ok(res, await service.buy(req.device.id, req.valid.params.id)));

const coinPacks = catchAsync(async (_req, res) => ok(res, coinPacksService.listCoinPacks()));
const buyCoinPack = catchAsync(async (req, res) =>
  ok(res, await coinPacksService.buyCoinPack(req.device.id, req.valid.params.id)));

module.exports = { items, buy, coinPacks, buyCoinPack };
