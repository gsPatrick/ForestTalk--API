const { Subscription } = require('../../models');

/** Premium ativo (e não vencido)? Usado pelo middleware `requirePremium` e pelo progresso. */
async function isPremium(deviceId) {
  const sub = await Subscription.findByPk(deviceId);
  if (!sub || sub.status !== 'active') return false;
  return !sub.expiresAt || sub.expiresAt.getTime() > Date.now();
}

module.exports = { isPremium };
