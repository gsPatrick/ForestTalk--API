const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const service = require('./collection.service');
const { unlock: unlockCard } = require('./collection-unlock.service');

const get = catchAsync(async (req, res) => ok(res, await service.getCollection(req.device.id)));
const equip = catchAsync(async (req, res) => ok(res, await service.equip(req.device.id, req.valid.body.animalId)));

const unlock = catchAsync(async (req, res) => {
  await unlockCard(req.device.id, req.valid.body.animalId);
  ok(res, await service.getCollection(req.device.id));
});

module.exports = { get, equip, unlock };
