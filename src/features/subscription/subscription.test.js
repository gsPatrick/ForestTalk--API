const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const env = require('../../config/env');
const { Subscription } = require('../../models');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { isPremium } = require('./premium-status.service');

const realFetch = global.fetch;
let rcResponse; // resposta simulada do RevenueCat
let rcCalls;

before(async () => {
  await startServer();
  global.fetch = (url, opts) => {
    if (String(url).startsWith('https://api.revenuecat.com')) {
      rcCalls.push(String(url));
      if (rcResponse instanceof Error) return Promise.reject(rcResponse);
      return Promise.resolve(new Response(JSON.stringify(rcResponse.body), { status: rcResponse.status }));
    }
    return realFetch(url, opts);
  };
});
after(async () => {
  global.fetch = realFetch;
  await stopServer();
});
beforeEach(() => {
  env.SUBSCRIPTION_TEST_MODE = true;
  env.REVENUECAT_API_KEY = '';
  env.REVENUECAT_WEBHOOK_AUTH = 'segredo-webhook';
  rcCalls = [];
  rcResponse = { status: 200, body: { subscriber: { entitlements: {} } } };
});

test('planos exigem auth e devolvem o plano único', async () => {
  assert.equal((await request('GET', '/v1/subscription/plans')).status, 401);
  const c = await newClient();
  const { body } = await c.get('/v1/subscription/plans');
  assert.deepEqual(body.data, [{ id: 'premium_monthly', title: 'Mensal', price: 'R$ 39,90', period: '/mês', highlighted: true }]);
});

test('status inicial, assinar em modo de teste e cancelar', async () => {
  const c = await newClient();
  assert.equal((await c.get('/v1/subscription')).body.data.isPremium, false);
  const sub = await c.post('/v1/subscription', { planId: 'premium_monthly' });
  assert.equal(sub.status, 200);
  assert.deepEqual(sub.body.data, { isPremium: true, planId: 'premium_monthly', source: 'test', expiresAt: null });
  assert.equal(await isPremium(c.deviceId), true);
  const del = await c.del('/v1/subscription');
  assert.equal(del.body.data.isPremium, false);
  assert.equal(await isPremium(c.deviceId), false);
});

test('plano inválido dá 400', async () => {
  const c = await newClient();
  const r = await c.post('/v1/subscription', { planId: 'gratis' });
  assert.equal(r.status, 400);
  assert.equal(r.body.error.code, 'VALIDATION_ERROR');
});

test('fora do modo de teste, POST / retorna 409 USE_STORE_PURCHASE', async () => {
  env.SUBSCRIPTION_TEST_MODE = false;
  const c = await newClient();
  const r = await c.post('/v1/subscription', { planId: 'premium_monthly' });
  assert.equal(r.status, 409);
  assert.equal(r.body.error.code, 'USE_STORE_PURCHASE');
});

test('restore em modo de teste ativa direto', async () => {
  const c = await newClient();
  const r = await c.post('/v1/subscription/restore');
  assert.deepEqual(r.body.data, { restored: true });
  assert.equal(await isPremium(c.deviceId), true);
  assert.equal(rcCalls.length, 0);
});

test('restore real consulta o RevenueCat: com e sem entitlement', async () => {
  env.SUBSCRIPTION_TEST_MODE = false;
  env.REVENUECAT_API_KEY = 'sk_teste';
  const c = await newClient();
  assert.deepEqual((await c.post('/v1/subscription/restore')).body.data, { restored: false });
  assert.ok(rcCalls[0].endsWith(`/subscribers/${c.deviceId}`));

  const future = new Date(Date.now() + 86_400_000).toISOString();
  rcResponse = { status: 200, body: { subscriber: { entitlements: { premium: { expires_date: future } } } } };
  assert.deepEqual((await c.post('/v1/subscription/restore')).body.data, { restored: true });
  const status = (await c.get('/v1/subscription')).body.data;
  assert.equal(status.source, 'revenuecat');
  assert.equal(status.expiresAt, future);
});

test('restore ignora entitlement vencido e erro da loja vira 502', async () => {
  env.SUBSCRIPTION_TEST_MODE = false;
  env.REVENUECAT_API_KEY = 'sk_teste';
  const c = await newClient();
  rcResponse = { status: 200, body: { subscriber: { entitlements: { premium: { expires_date: '2020-01-01T00:00:00Z' } } } } };
  assert.deepEqual((await c.post('/v1/subscription/restore')).body.data, { restored: false });
  rcResponse = { status: 500, body: {} };
  const r = await c.post('/v1/subscription/restore');
  assert.equal(r.status, 502);
  assert.equal(r.body.error.code, 'STORE_UNAVAILABLE');
  rcResponse = new Error('timeout');
  assert.equal((await c.post('/v1/subscription/restore')).status, 502);
});

test('premium vencido (expires_at no passado) deixa de valer', async () => {
  const c = await newClient();
  await Subscription.update({ status: 'active', expiresAt: new Date(Date.now() - 1000) }, { where: { deviceId: c.deviceId } });
  assert.equal(await isPremium(c.deviceId), false);
  assert.equal((await c.get('/v1/subscription')).body.data.isPremium, false);
});
