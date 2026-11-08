const env = require('../../config/env');
const AppError = require('../../utils/app-error');

const BASE_URL = 'https://api.revenuecat.com/v1';
const TIMEOUT_MS = 8000;

const unavailable = (message = 'Loja indisponível no momento. Tente novamente.') =>
  new AppError(502, 'STORE_UNAVAILABLE', message);

/**
 * Consulta o assinante no RevenueCat (REST v1). `appUserId` é o deviceId.
 * Devolve `subscriber` (ou `null` se o RevenueCat não conhece o id). Falhas viram 502 STORE_UNAVAILABLE.
 */
async function fetchSubscriber(appUserId) {
  if (!env.REVENUECAT_API_KEY) throw unavailable('RevenueCat não configurado');
  let res;
  try {
    res = await fetch(`${BASE_URL}/subscribers/${encodeURIComponent(appUserId)}`, {
      headers: { authorization: `Bearer ${env.REVENUECAT_API_KEY}`, 'content-type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw unavailable();
  }
  if (res.status === 404) return null;
  if (!res.ok) throw unavailable();
  try {
    const json = await res.json();
    return json.subscriber ?? null;
  } catch {
    throw unavailable();
  }
}

module.exports = { fetchSubscriber };
