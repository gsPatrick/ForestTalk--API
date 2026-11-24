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

const env = require('../../config/env');

test('catálogo de pacotes de moedas', async () => {
  assert.equal((await request('GET', '/v1/shop/coin-packs')).status, 401);
  const c = await newClient();
  const { status, body } = await c.get('/v1/shop/coin-packs');
  assert.equal(status, 200);
  assert.deepEqual(body.data.map((p) => [p.id, p.coins, p.fifty, p.hint, p.price, p.priceCents, p.emoji, p.badge]), [
    ['coins_400', 400, 0, 0, 'R$ 6,90', 690, '🪙', null],
    ['coins_1200', 1200, 0, 0, 'R$ 17,90', 1790, '💰', null],
    ['coins_2750', 2750, 0, 0, 'R$ 34,90', 3490, '🎁', 'Mais popular'],
    ['coins_6000', 6000, 0, 0, 'R$ 69,90', 6990, '🧰', null],
    ['coins_17500', 17500, 0, 0, 'R$ 169,90', 16990, '👑', 'Melhor custo'],
    ['pack_explorer', 1500, 10, 10, 'R$ 19,90', 1990, '🎒', 'Pacote'],
  ]);
  assert.equal(body.data[0].storeProductId, 'com.foresttalk.app.coins_400');
  assert.equal(typeof body.data[0].title, 'string');
});

test('compra de pacote em modo de teste credita moedas e power-ups', async () => {
  env.SUBSCRIPTION_TEST_MODE = true;
  const c = await newClient();
  let r = await c.post('/v1/shop/coin-packs/coins_400/buy');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { result: 'ok', coins: 400, powerUps: { fifty: 2, hint: 2 } });
  r = await c.post('/v1/shop/coin-packs/pack_explorer/buy');
  assert.deepEqual(r.body.data, { result: 'ok', coins: 1900, powerUps: { fifty: 12, hint: 12 } });
});

test('pacote: id inválido dá unknownItem e fora do modo de teste dá 409', async () => {
  env.SUBSCRIPTION_TEST_MODE = true;
  const c = await newClient();
  const r = await c.post('/v1/shop/coin-packs/nada/buy');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { result: 'unknownItem', coins: 0, powerUps: { fifty: 2, hint: 2 } });
  env.SUBSCRIPTION_TEST_MODE = false;
  const b = await c.post('/v1/shop/coin-packs/coins_400/buy');
  assert.equal(b.status, 409);
  assert.equal(b.body.error.code, 'USE_STORE_PURCHASE');
  env.SUBSCRIPTION_TEST_MODE = true;
  assert.equal((await c.get('/v1/wallet')).body.data.coins, 0);
});
