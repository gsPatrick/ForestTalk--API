const crypto = require('node:crypto');
const env = require('../../config/env');
const AppError = require('../../utils/app-error');
const { sequelize, Subscription, WebhookEvent, Wallet } = require('../../models');
const { ACTIVATING_EVENTS, planFromProductId } = require('./subscription.constants');
const { creditPack, findByStoreProduct } = require('../shop/coin-packs.service');
const { setActive, setInactive } = require('./subscription-activate.service');
const { syncFromStore } = require('./subscription-restore.service');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Compara o header `Authorization` com `REVENUECAT_WEBHOOK_AUTH` (401 se ausente/diferente/não configurado). */
function assertAuthorized(header) {
  const expected = env.REVENUECAT_WEBHOOK_AUTH;
  const a = Buffer.from(header || '');
  const b = Buffer.from(expected);
  if (!expected || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw AppError.unauthorized('Webhook não autorizado', 'INVALID_WEBHOOK_AUTH');
  }
}

const toDate = (ms) => (typeof ms === 'number' ? new Date(ms) : null);

const isDeviceId = (id) => UUID_RE.test(id ?? '');

/** O app usa o deviceId como app_user_id; ids anônimos do RevenueCat aparecem em `aliases`. */
async function findDeviceId(event, transaction) {
  const candidates = [event.app_user_id, event.original_app_user_id, ...(event.aliases ?? [])];
  for (const id of candidates.filter(isDeviceId)) {
    if (await Subscription.findByPk(id, { transaction })) return id;
  }
  return null;
}

/** Aparelho dono da carteira (compra avulsa não exige assinatura prévia). */
async function findWalletDeviceId(event, transaction) {
  const candidates = [event.app_user_id, event.original_app_user_id, ...(event.aliases ?? [])];
  for (const id of candidates.filter(isDeviceId)) {
    if (await Wallet.findByPk(id, { transaction })) return id;
  }
  return null;
}

/** Plano do evento: pelo product id; sem id reconhecível mantém o plano atual, senão Premium (padrão). */
async function planOf(event, deviceId, transaction) {
  const known = planFromProductId(event.product_id);
  if (known || event.product_id) return known ?? undefined;
  return (await Subscription.findByPk(deviceId, { transaction }))?.planId ?? undefined;
}

/** TRANSFER: o entitlement mudou de dono; confere na loja os dois lados. */
async function applyTransfer(event, transaction) {
  const ids = [...(event.transferred_from ?? []), ...(event.transferred_to ?? [])].filter(isDeviceId);
  for (const id of ids) {
    if (await Subscription.findByPk(id, { transaction })) await syncFromStore(id, { transaction });
  }
}

/** Aplica o evento ao aparelho. Eventos desconhecidos (TEST, SUBSCRIPTION_PAUSED...) são ignorados. */
async function applyEvent(event, deviceId, transaction) {
  const expiresAt = toDate(event.expiration_at_ms);
  if (ACTIVATING_EVENTS.includes(event.type)) {
    const planId = await planOf(event, deviceId, transaction);
    return setActive({ deviceId, planId, source: 'revenuecat', expiresAt }, { transaction });
  }
  if (event.type === 'CANCELLATION') {
    // Cancelou a renovação, mas o acesso vale até expirar.
    if (expiresAt) await Subscription.update({ expiresAt }, { where: { deviceId, status: 'active' }, transaction });
    return undefined;
  }
  if (event.type === 'EXPIRATION') return setInactive(deviceId, { transaction });
  if (event.type === 'BILLING_ISSUE') {
    const end = toDate(event.grace_period_expiration_at_ms) ?? expiresAt;
    if (!end || end.getTime() <= Date.now()) return setInactive(deviceId, { transaction });
    await Subscription.update({ expiresAt: end }, { where: { deviceId, status: 'active' }, transaction });
  }
  return undefined;
}

/** Processa um webhook do RevenueCat de forma idempotente (pelo `event.id`). */
async function handleWebhook(authHeader, { event }) {
  assertAuthorized(authHeader);
  return sequelize.transaction(async (transaction) => {
    const [record, isNew] = await WebhookEvent.findOrCreate({
      where: { id: event.id },
      defaults: { type: event.type, payload: { event } },
      transaction,
    });
    if (!isNew) return { duplicate: true };
    const pack = findByStoreProduct(event.product_id);
    if (pack && event.type === 'NON_RENEWING_PURCHASE') {
      // Compra avulsa de pacote de moedas: credita uma vez (o `event.id` acima barra reenvios).
      const deviceId = await findWalletDeviceId(event, transaction);
      if (deviceId) await creditPack(deviceId, pack, { transaction });
    } else if (event.type === 'TRANSFER') await applyTransfer(event, transaction);
    else {
      const deviceId = await findDeviceId(event, transaction);
      if (deviceId) await applyEvent(event, deviceId, transaction);
    }
    await record.update({ processedAt: new Date() }, { transaction });
    return { duplicate: false };
  });
}

module.exports = { handleWebhook };
