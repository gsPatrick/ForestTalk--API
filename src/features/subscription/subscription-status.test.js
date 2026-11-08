const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const env = require('../../config/env');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { isPremium } = require('./premium-status.service');

before(startServer);
after(stopServer);
beforeEach(() => {
  env.SUBSCRIPTION_TEST_MODE = true;
});

test('PUT /subscription/status exige auth e valida o corpo', async () => {
  assert.equal((await request('PUT', '/v1/subscription/status', { body: { isPremium: true } })).status, 401);
  const c = await newClient();
  assert.equal((await c.put('/v1/subscription/status', {})).status, 400);
  assert.equal((await c.put('/v1/subscription/status', { isPremium: 'sim' })).status, 400);
});

test('liga e desliga o Premium (modo de teste) e o progresso reflete', async () => {
  const c = await newClient();
  let r = await c.put('/v1/subscription/status', { isPremium: true });
  assert.equal(r.status, 200);
  assert.equal(r.body.data.isPremium, true);
  assert.equal(await isPremium(c.deviceId), true);
  assert.equal((await c.get('/v1/languages/en/progress')).body.data.isPremium, true);

  r = await c.put('/v1/subscription/status', { isPremium: false });
  assert.equal(r.body.data.isPremium, false);
  assert.equal(await isPremium(c.deviceId), false);
});

test('fora do modo de teste, 409 USE_STORE_PURCHASE', async () => {
  env.SUBSCRIPTION_TEST_MODE = false;
  const c = await newClient();
  const r = await c.put('/v1/subscription/status', { isPremium: true });
  assert.equal(r.status, 409);
  assert.equal(r.body.error.code, 'USE_STORE_PURCHASE');
});
