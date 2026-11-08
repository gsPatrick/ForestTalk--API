const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

async function withCoins(n) {
  const c = await newClient();
  await c.post('/v1/wallet/earn', { amount: n });
  return c;
}

test('GET exige auth e devolve carteira inicial', async () => {
  assert.equal((await request('GET', '/v1/wallet')).status, 401);
  assert.equal((await request('POST', '/v1/wallet/spend', { body: { amount: 1 } })).status, 401);
  const c = await newClient();
  assert.deepEqual((await c.get('/v1/wallet')).body.data, { coins: 0, powerUps: { fifty: 2, hint: 2 } });
});

test('spend valida o corpo (400)', async () => {
  const c = await newClient();
  for (const amount of [0, -5, 1.5, '10', undefined]) assert.equal((await c.post('/v1/wallet/spend', { amount })).status, 400);
});

test('spend: gasta com saldo e recusa sem saldo', async () => {
  const c = await withCoins(30);
  let r = await c.post('/v1/wallet/spend', { amount: 20 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { ok: true, coins: 10 });
  r = await c.post('/v1/wallet/spend', { amount: 20 });
  assert.deepEqual(r.body.data, { ok: false, coins: 10 });
});

test('earn soma moedas ao saldo global e valida o corpo', async () => {
  assert.equal((await request('POST', '/v1/wallet/earn', { body: { amount: 5 } })).status, 401);
  const c = await newClient();
  const r = await c.post('/v1/wallet/earn', { amount: 25 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { coins: 25, powerUps: { fifty: 2, hint: 2 } });
  for (const amount of [0, -5, 1.5, '10', undefined]) assert.equal((await c.post('/v1/wallet/earn', { amount })).status, 400);
});

test('gastos concorrentes nunca deixam o saldo negativo', async () => {
  const c = await withCoins(30);
  const rs = await Promise.all(Array.from({ length: 8 }, () => c.post('/v1/wallet/spend', { amount: 20 })));
  assert.equal(rs.filter((r) => r.body.data.ok).length, 1);
  assert.equal((await c.get('/v1/wallet')).body.data.coins, 10);
});
