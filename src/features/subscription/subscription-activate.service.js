const { Subscription } = require('../../models');
const env = require('../../config/env');
const AppError = require('../../utils/app-error');
const { PREMIUM_PLAN_ID } = require('./subscription.constants');
const { getStatus } = require('./subscription-status.service');

/** Grava o Premium ativo (usado pelo modo de teste, pelo restore e pelo webhook). */
async function setActive({ deviceId, planId = PREMIUM_PLAN_ID, source, expiresAt = null }, options = {}) {
  await Subscription.upsert({ deviceId, planId, status: 'active', source, expiresAt }, options);
}

/** Grava o Premium inativo (mantém o histórico de plano/origem). */
async function setInactive(deviceId, options = {}) {
  await Subscription.update({ status: 'inactive', expiresAt: null }, { where: { deviceId }, ...options });
}

/** `POST /subscription`: só em modo de teste. Em produção a compra vem da loja → RevenueCat → webhook. */
async function activate(deviceId, planId) {
  if (!env.SUBSCRIPTION_TEST_MODE) {
    throw AppError.conflict('A compra deve ser feita pela loja de aplicativos', 'USE_STORE_PURCHASE');
  }
  await setActive({ deviceId, planId, source: 'test' });
  return getStatus(deviceId);
}

/** `DELETE /subscription`: cancela o Premium. */
async function cancel(deviceId) {
  await setInactive(deviceId);
  return getStatus(deviceId);
}

/** `PUT /subscription/status` (contrato do app): liga/desliga o Premium. Só em modo de teste, sem cobrança. */
async function setPremium(deviceId, value) {
  if (!env.SUBSCRIPTION_TEST_MODE) {
    throw AppError.conflict('O Premium só muda pela loja de aplicativos', 'USE_STORE_PURCHASE');
  }
  if (value) await setActive({ deviceId, source: 'test' });
  else await setInactive(deviceId);
  return getStatus(deviceId);
}

module.exports = { activate, cancel, setPremium, setActive, setInactive };
