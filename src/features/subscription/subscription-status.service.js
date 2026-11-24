const { Subscription } = require('../../models');
const { ADS_FREE_PLAN_IDS, PREMIUM_PLAN_ID } = require('./subscription.constants');
const { activeSubscription } = require('./premium-status.service');

const NO_PLAN = { isPremium: false, adsFree: false, planId: null, source: null, expiresAt: null };

/** Estado da assinatura: `{isPremium, adsFree, planId, source, expiresAt}` (`planId` = plano ativo). */
async function getStatus(deviceId) {
  const active = await activeSubscription(deviceId, ADS_FREE_PLAN_IDS);
  if (!active) return { ...NO_PLAN, source: (await Subscription.findByPk(deviceId))?.source ?? null };
  return {
    isPremium: active.planId === PREMIUM_PLAN_ID,
    adsFree: true,
    planId: active.planId,
    source: active.source,
    expiresAt: active.expiresAt ? active.expiresAt.toISOString() : null,
  };
}

module.exports = { getStatus };
