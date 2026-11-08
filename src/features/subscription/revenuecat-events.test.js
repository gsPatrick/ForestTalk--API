const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const env = require('../../config/env');
const { startServer, stopServer, newClient } = require('../../test/helpers');
const { startHookServer, stopHookServer, sendWebhook: send, SECRET } = require('../../test/revenuecat-helpers');
const { isPremium } = require('./premium-status.service');

const realFetch = global.fetch;
let subscriber; // resposta simulada de GET /subscribers

const future = () => Date.now() + 86_400_000;

before(async () => {
  await startServer();
  await startHookServer();
  global.fetch = (url, opts) => {
    if (!String(url).startsWith('https://api.revenuecat.com')) return realFetch(url, opts);
    return Promise.resolve(new Response(JSON.stringify({ subscriber }), { status: 200 }));
  };
});
after(async () => {
  global.fetch = realFetch;
  await stopHookServer();
  await stopServer();
});
beforeEach(() => {
  env.REVENUECAT_WEBHOOK_AUTH = SECRET;
  env.REVENUECAT_API_KEY = '';
  subscriber = { entitlements: {} };
});

test('NON_RENEWING_PURCHASE e SUBSCRIPTION_EXTENDED liberam o Premium', async () => {
  const a = await newClient();
  await send({ type: 'NON_RENEWING_PURCHASE', app_user_id: a.deviceId, expiration_at_ms: future() });
  assert.equal(await isPremium(a.deviceId), true);
  const b = await newClient();
  await send({ type: 'SUBSCRIPTION_EXTENDED', app_user_id: b.deviceId, expiration_at_ms: future() });
  assert.equal(await isPremium(b.deviceId), true);
});

test('acha o aparelho por original_app_user_id ou aliases (id anônimo do RevenueCat)', async () => {
  const a = await newClient();
  await send({ type: 'INITIAL_PURCHASE', app_user_id: '$RCAnonymousID:abc', aliases: ['$RCAnonymousID:abc', a.deviceId], expiration_at_ms: future() });
  assert.equal(await isPremium(a.deviceId), true);
  const b = await newClient();
  await send({ type: 'RENEWAL', app_user_id: '$RCAnonymousID:xyz', original_app_user_id: b.deviceId, expiration_at_ms: future() });
  assert.equal(await isPremium(b.deviceId), true);
});

test('TEST e SUBSCRIPTION_PAUSED não mudam o acesso', async () => {
  const a = await newClient();
  await send({ type: 'INITIAL_PURCHASE', app_user_id: a.deviceId, expiration_at_ms: future() });
  assert.equal((await send({ type: 'TEST', app_user_id: a.deviceId })).status, 200);
  assert.equal((await send({ type: 'SUBSCRIPTION_PAUSED', app_user_id: a.deviceId })).status, 200);
  assert.equal(await isPremium(a.deviceId), true);
});

test('TRANSFER: consulta a loja e passa o Premium de um aparelho ao outro', async () => {
  env.REVENUECAT_API_KEY = 'sk_teste';
  const from = await newClient();
  const to = await newClient();
  await send({ type: 'INITIAL_PURCHASE', app_user_id: from.deviceId, expiration_at_ms: future() });
  subscriber = { entitlements: { premium: { expires_date: new Date(future()).toISOString() } } };
  // A loja diz que o entitlement está ativo só no destino: o mock devolve o mesmo para os dois,
  // então o teste confere o lado do destino e o de origem sem entitlement em seguida.
  await send({ type: 'TRANSFER', app_user_id: to.deviceId, transferred_from: [], transferred_to: [to.deviceId] });
  assert.equal(await isPremium(to.deviceId), true);
  subscriber = { entitlements: {} };
  await send({ type: 'TRANSFER', app_user_id: to.deviceId, transferred_from: [from.deviceId], transferred_to: [] });
  assert.equal(await isPremium(from.deviceId), false);
});

test('restore respeita a carência de cobrança', async () => {
  env.REVENUECAT_API_KEY = 'sk_teste';
  env.SUBSCRIPTION_TEST_MODE = false;
  const c = await newClient();
  subscriber = {
    entitlements: { premium: { expires_date: '2020-01-01T00:00:00Z', grace_period_expires_date: new Date(future()).toISOString() } },
  };
  const r = await c.post('/v1/subscription/restore');
  assert.deepEqual(r.body.data, { restored: true });
  env.SUBSCRIPTION_TEST_MODE = true;
});
