const env = require('../../config/env');
const { fetchSubscriber } = require('../../providers/revenuecat/revenuecat.client');
const { activeEntitlement, entitlementEnd } = require('./revenuecat-entitlement');
const { setActive, setInactive } = require('./subscription-activate.service');

/** `POST /subscription/restore`: reativa o Premium se a loja (via RevenueCat) tiver compra ativa. */
async function restore(deviceId) {
  if (env.SUBSCRIPTION_TEST_MODE && !env.REVENUECAT_API_KEY) {
    await setActive({ deviceId, source: 'test' });
    return { restored: true };
  }
  const entitlement = activeEntitlement(await fetchSubscriber(deviceId));
  if (!entitlement) return { restored: false };
  await setActive({ deviceId, source: 'revenuecat', expiresAt: entitlementEnd(entitlement) });
  return { restored: true };
}

/** Alinha o aparelho ao que o RevenueCat diz agora (usado no TRANSFER): liga ou desliga o Premium. */
async function syncFromStore(deviceId, options = {}) {
  if (!env.REVENUECAT_API_KEY) return;
  const entitlement = activeEntitlement(await fetchSubscriber(deviceId));
  if (!entitlement) return setInactive(deviceId, options);
  return setActive({ deviceId, source: 'revenuecat', expiresAt: entitlementEnd(entitlement) }, options);
}

module.exports = { restore, syncFromStore };
