const toMs = (iso) => (iso ? new Date(iso).getTime() : null);

/**
 * Entitlement ativo no `subscriber` do RevenueCat: sem `expires_date` (vitalício) ou com data futura.
 * Em carência de cobrança (`grace_period_expires_date` futura) o acesso continua.
 */
function activeEntitlement(subscriber) {
  const now = Date.now();
  return (
    Object.values(subscriber?.entitlements ?? {}).find((e) => {
      const expires = toMs(e.expires_date);
      const grace = toMs(e.grace_period_expires_date);
      return expires === null || expires > now || (grace !== null && grace > now);
    }) ?? null
  );
}

/** Data de fim do acesso (a maior entre expiração e carência), ou null se vitalício. */
function entitlementEnd(entitlement) {
  if (!entitlement.expires_date) return null;
  return new Date(Math.max(toMs(entitlement.expires_date), toMs(entitlement.grace_period_expires_date) ?? 0));
}

module.exports = { activeEntitlement, entitlementEnd };
