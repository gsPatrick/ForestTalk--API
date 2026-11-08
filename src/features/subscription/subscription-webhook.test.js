const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const env = require('../../config/env');
const { startServer, stopServer, newClient } = require('../../test/helpers');
const { startHookServer, stopHookServer, webhook, sendWebhook: send, SECRET } = require('../../test/revenuecat-helpers');
const { isPremium } = require('./premium-status.service');

before(async () => {
  await startServer();
  await startHookServer();
});
after(async () => {
  await stopHookServer();
  await stopServer();
});
beforeEach(() => {
  env.REVENUECAT_WEBHOOK_AUTH = SECRET;
});

test('webhook exige o header Authorization correto', async () => {
  const c = await newClient();
  const ev = { type: 'INITIAL_PURCHASE', app_user_id: c.deviceId };
  assert.equal((await send(ev, '')).status, 401);
  assert.equal((await send(ev, 'errado')).status, 401);
  assert.equal(await isPremium(c.deviceId), false);
  env.REVENUECAT_WEBHOOK_AUTH = '';
  assert.equal((await send(ev, '')).status, 401);
});

test('webhook ativa com expires_at, é idempotente e EXPIRATION desativa', async () => {
  const c = await newClient();
  const fixedId = `ev-fixo-${c.deviceId}`;
  const exp = Date.now() + 3_600_000;
  const first = await webhook({ id: fixedId, type: 'INITIAL_PURCHASE', app_user_id: c.deviceId, expiration_at_ms: exp }, SECRET);
  assert.equal(first.status, 200);
  assert.equal(first.body.data.duplicate, false);
  const st = (await c.get('/v1/subscription')).body.data;
  assert.equal(st.isPremium, true);
  assert.equal(st.source, 'revenuecat');
  assert.equal(new Date(st.expiresAt).getTime(), exp);

  await c.del('/v1/subscription');
  const again = await webhook({ id: fixedId, type: 'INITIAL_PURCHASE', app_user_id: c.deviceId, expiration_at_ms: exp }, SECRET);
  assert.equal(again.body.data.duplicate, true);
  assert.equal(await isPremium(c.deviceId), false); // reenvio não reativou

  await send({ type: 'RENEWAL', app_user_id: c.deviceId, expiration_at_ms: exp });
  assert.equal(await isPremium(c.deviceId), true);
  await send({ type: 'CANCELLATION', app_user_id: c.deviceId, expiration_at_ms: exp });
  assert.equal(await isPremium(c.deviceId), true); // vale até expirar
  await send({ type: 'EXPIRATION', app_user_id: c.deviceId });
  assert.equal(await isPremium(c.deviceId), false);
});

test('BILLING_ISSUE: mantém na carência e desativa depois dela', async () => {
  const c = await newClient();
  await send({ type: 'INITIAL_PURCHASE', app_user_id: c.deviceId, expiration_at_ms: Date.now() + 1000 });
  await send({ type: 'BILLING_ISSUE', app_user_id: c.deviceId, grace_period_expiration_at_ms: Date.now() + 86_400_000 });
  assert.equal(await isPremium(c.deviceId), true);
  await send({ type: 'BILLING_ISSUE', app_user_id: c.deviceId, grace_period_expiration_at_ms: Date.now() - 1000 });
  assert.equal(await isPremium(c.deviceId), false);
});

test('webhook ignora ids inexistentes e eventos desconhecidos sem quebrar', async () => {
  assert.equal((await send({ type: 'INITIAL_PURCHASE', app_user_id: '00000000-0000-4000-8000-000000000000' })).status, 200);
  assert.equal((await send({ type: 'INITIAL_PURCHASE', app_user_id: '$RCAnonymousID:abc' })).status, 200);
  const c = await newClient();
  assert.equal((await send({ type: 'TEST', app_user_id: c.deviceId })).status, 200);
  assert.equal(await isPremium(c.deviceId), false);
});
