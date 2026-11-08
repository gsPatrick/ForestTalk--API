const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { Subscription } = require('../../models');

before(startServer);
after(stopServer);

async function premiumClient() {
  const c = await newClient();
  await Subscription.upsert({ deviceId: c.deviceId, status: 'active', source: 'test' });
  return c;
}

test('exige token (401) e Premium (403)', async () => {
  assert.equal((await request('GET', '/v1/sim/scenarios')).status, 401);
  const free = await newClient();
  const res = await free.get('/v1/sim/scenarios');
  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, 'PREMIUM_REQUIRED');
});

test('lista cenários e devolve cenário completo no idioma', async () => {
  const c = await premiumClient();
  const list = await c.get('/v1/sim/scenarios');
  assert.equal(list.status, 200);
  assert.ok(list.body.data.length > 0);
  assert.deepEqual(Object.keys(list.body.data[0]).sort(), ['best', 'emoji', 'goal', 'id', 'level', 'title', 'turns']);
  const one = await c.get('/v1/sim/scenarios/sc01?lang=en');
  assert.equal(one.status, 200);
  assert.equal(one.body.data.summary.id, 'sc01');
  assert.equal(one.body.data.turns[0].options.length, 3);
  assert.ok(one.body.data.npcName);
  const ru = await c.get('/v1/sim/scenarios/sc01?lang=ru');
  assert.ok(ru.body.data.turns[0].npcTranslit);
});

test('404 SCENARIO_NOT_FOUND e 400 para lang inválido', async () => {
  const c = await premiumClient();
  const nf = await c.get('/v1/sim/scenarios/nope?lang=en');
  assert.equal(nf.status, 404);
  assert.equal(nf.body.error.code, 'SCENARIO_NOT_FOUND');
  assert.equal((await c.get('/v1/sim/scenarios/sc01?lang=xx')).status, 400);
  assert.equal((await c.get('/v1/sim/scenarios/sc01')).status, 400);
});

test('complete valida stars e languageCode', async () => {
  const c = await premiumClient();
  for (const body of [{ languageCode: 'en', stars: 0 }, { languageCode: 'en', stars: 4 }, { languageCode: 'en', stars: 1.5 }, { languageCode: 'xx', stars: 2 }, {}]) {
    assert.equal((await c.post('/v1/sim/scenarios/sc01/complete', body)).status, 400);
  }
  assert.equal((await c.post('/v1/sim/scenarios/nope/complete', { languageCode: 'en', stars: 2 })).status, 404);
});

test('firstTime só na 1ª vez; melhor nota nunca diminui; mapa por idioma; sem moedas aqui', async () => {
  const c = await premiumClient();
  const first = await c.post('/v1/sim/scenarios/sc01/complete', { languageCode: 'en', stars: 2 });
  assert.equal(first.status, 200);
  assert.deepEqual(first.body.data, { firstTime: true });

  const second = await c.post('/v1/sim/scenarios/sc01/complete', { languageCode: 'en', stars: 3 });
  assert.deepEqual(second.body.data, { firstTime: false });
  await c.post('/v1/sim/scenarios/sc01/complete', { languageCode: 'en', stars: 1 });
  assert.equal((await c.get('/v1/wallet')).body.data.coins, 0, 'as moedas vêm do app via /wallet/earn');

  const map = await c.get('/v1/sim/completions?lang=en');
  assert.deepEqual(map.body.data, { sc01: 3 });
  assert.deepEqual((await c.get('/v1/sim/completions?lang=es')).body.data, {});

  const other = await c.post('/v1/sim/scenarios/sc01/complete', { languageCode: 'es', stars: 3 });
  assert.equal(other.body.data.firstTime, true);
});
