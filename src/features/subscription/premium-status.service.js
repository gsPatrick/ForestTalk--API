const { Subscription } = require('../../models');
const { PREMIUM_PLAN_ID, ADS_FREE_PLAN_IDS } = require('./subscription.constants');

/** Assinatura ativa (e não vencida) de um dos planos? Devolve a linha ou null. */
async function activeSubscription(deviceId, planIds) {
  const sub = await Subscription.findByPk(deviceId);
  if (!sub || sub.status !== 'active' || !planIds.includes(sub.planId)) return null;
  return !sub.expiresAt || sub.expiresAt.getTime() > Date.now() ? sub : null;
}

/**
 * Premium ativo (e não vencido)? Só o plano `premium_monthly` conta: libera IA, Simulações e vidas
 * infinitas. Usado pelo middleware `requirePremium` e pelo progresso.
 */
async function isPremium(deviceId) {
  return (await activeSubscription(deviceId, [PREMIUM_PLAN_ID])) !== null;
}

/** Sem anúncios? Verdadeiro com qualquer um dos dois planos ativos (Premium inclui). */
async function isAdsFree(deviceId) {
  return (await activeSubscription(deviceId, ADS_FREE_PLAN_IDS)) !== null;
}

module.exports = { isPremium, isAdsFree, activeSubscription };
