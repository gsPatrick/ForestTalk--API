const { isPremium } = require('../features/subscription/premium-status.service');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

/** Libera só quem tem Premium ativo (conversa por voz e simulações). Use depois de `auth`. */
const requirePremium = catchAsync(async (req, _res, next) => {
  if (!(await isPremium(req.device.id))) {
    throw AppError.forbidden('Recurso exclusivo para assinantes Premium', 'PREMIUM_REQUIRED');
  }
  next();
});

module.exports = requirePremium;
