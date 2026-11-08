const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

test('exige auth', async () => {
  assert.equal((await request('GET', '/v1/power-ups')).status, 401);
  assert.equal((await request('POST', '/v1/power-ups/consume', { body: { type: 'hint' } })).status, 401);
});

test('GET devolve o estoque inicial', async () => {
  const c = await newClient();
  assert.deepEqual((await c.get('/v1/power-ups')).body.data, { fifty: 2, hint: 2 });
});

test('consume valida o tipo (400)', async () => {
  const c = await newClient();
  assert.equal((await c.post('/v1/power-ups/consume', { type: 'life' })).status, 400);
  assert.equal((await c.post('/v1/power-ups/consume', {})).status, 400);
});

test('consome até zerar e depois 409 NO_POWER_UP', async () => {
  const c = await newClient();
  assert.deepEqual((await c.post('/v1/power-ups/consume', { type: 'fifty' })).body.data, { fifty: 1, hint: 2 });
  await c.post('/v1/power-ups/consume', { type: 'fifty' });
  const r = await c.post('/v1/power-ups/consume', { type: 'fifty' });
  assert.equal(r.status, 409);
  assert.equal(r.body.error.code, 'NO_POWER_UP');
  assert.deepEqual((await c.get('/v1/power-ups')).body.data, { fifty: 0, hint: 2 });
});

test('consumo concorrente nunca passa do estoque', async () => {
  const c = await newClient();
  const rs = await Promise.all(Array.from({ length: 6 }, () => c.post('/v1/power-ups/consume', { type: 'hint' })));
  assert.equal(rs.filter((r) => r.status === 200).length, 2);
  assert.equal((await c.get('/v1/power-ups')).body.data.hint, 0);
});

test('grant soma ao estoque (recompensa de baú) e valida o corpo', async () => {
  assert.equal((await request('POST', '/v1/power-ups/grant', { body: { hint: 1 } })).status, 401);
  const c = await newClient();
  let r = await c.post('/v1/power-ups/grant', { fifty: 1, hint: 2 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { fifty: 3, hint: 4 });
  r = await c.post('/v1/power-ups/grant', { hint: 1 });
  assert.deepEqual(r.body.data, { fifty: 3, hint: 5 });
  assert.equal((await c.post('/v1/power-ups/grant', { fifty: -1 })).status, 400);
  assert.equal((await c.post('/v1/power-ups/grant', { hint: 1.5 })).status, 400);
});
