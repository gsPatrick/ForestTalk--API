const { Subscription } = require('../../models');
const { isPremium } = require('./premium-status.service');

const NO_PLAN = { isPremium: false, planId: null, source: null, expiresAt: null };

/** Estado da assinatura no formato do app: `{isPremium, planId, source, expiresAt}`. */
async function getStatus(deviceId) {
  const sub = await Subscription.findByPk(deviceId);
  if (!sub || !(await isPremium(deviceId))) return { ...NO_PLAN, source: sub?.source ?? null };
  return {
    isPremium: true,
    planId: sub.planId,
    source: sub.source,
    expiresAt: sub.expiresAt ? sub.expiresAt.toISOString() : null,
  };
}

module.exports = { getStatus };
