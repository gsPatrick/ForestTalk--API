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

test('exige auth', async () => {
  assert.equal((await request('GET', '/v1/shop/items')).status, 401);
  assert.equal((await request('POST', '/v1/shop/items/hint_1/buy')).status, 401);
});

test('catálogo igual ao ShopCatalog', async () => {
  const c = await newClient();
  const { status, body } = await c.get('/v1/shop/items');
  assert.equal(status, 200);
  assert.deepEqual(body.data.map((i) => [i.id, i.price, i.fifty, i.hint]), [
    ['fifty_1', 30, 1, 0],
    ['hint_1', 20, 0, 1],
    ['kit_3', 120, 3, 3],
  ]);
  for (const key of ['emoji', 'title', 'description']) assert.equal(typeof body.data[0][key], 'string');
});

test('compra entrega power-ups e desconta moedas', async () => {
  const c = await withCoins(30);
  const r = await c.post('/v1/shop/items/hint_1/buy');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { result: 'ok', coins: 10, powerUps: { fifty: 2, hint: 3 } });
});

test('PurchaseResult: unknownItem e notEnoughCoins (200) sem efeitos', async () => {
  const c = await withCoins(10);
  let r = await c.post('/v1/shop/items/nada/buy');
  assert.equal(r.status, 200);
  assert.equal(r.body.data.result, 'unknownItem');
  r = await c.post('/v1/shop/items/kit_3/buy');
  assert.equal(r.status, 200);
  assert.equal(r.body.data.result, 'notEnoughCoins');
  assert.deepEqual((await c.get('/v1/wallet')).body.data, { coins: 10, powerUps: { fifty: 2, hint: 2 } });
});

test('compras concorrentes: só compra o que o saldo paga', async () => {
  const c = await withCoins(40);
  const rs = await Promise.all(Array.from({ length: 5 }, () => c.post('/v1/shop/items/hint_1/buy')));
  assert.equal(rs.filter((r) => r.body.data.result === 'ok').length, 2);
  assert.deepEqual((await c.get('/v1/wallet')).body.data, { coins: 0, powerUps: { fifty: 2, hint: 4 } });
});
