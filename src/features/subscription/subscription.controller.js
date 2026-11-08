const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const { PLANS } = require('./subscription.constants');
const { getStatus } = require('./subscription-status.service');
const { activate, cancel, setPremium } = require('./subscription-activate.service');
const { restore } = require('./subscription-restore.service');
const { handleWebhook } = require('./revenuecat-webhook.service');

const plans = catchAsync(async (_req, res) => ok(res, PLANS));
const status = catchAsync(async (req, res) => ok(res, await getStatus(req.device.id)));
const subscribe = catchAsync(async (req, res) => ok(res, await activate(req.device.id, req.valid.body.planId)));
const unsubscribe = catchAsync(async (req, res) => ok(res, await cancel(req.device.id)));
const premiumStatus = catchAsync(async (req, res) => ok(res, await setPremium(req.device.id, req.valid.body.isPremium)));
const restorePurchases = catchAsync(async (req, res) => ok(res, await restore(req.device.id)));
const revenuecatWebhook = catchAsync(async (req, res) =>
  ok(res, await handleWebhook(req.headers.authorization, req.valid.body)));

module.exports = { plans, status, subscribe, unsubscribe, premiumStatus, restorePurchases, revenuecatWebhook };
