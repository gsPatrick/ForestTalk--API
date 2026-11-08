const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

async function withOneCard() {
  const c = await newClient();
  await c.post('/v1/collection/unlock', { animalId: 'rabbit' });
  return c;
}

test('exige auth', async () => {
  assert.equal((await request('GET', '/v1/collection')).status, 401);
  assert.equal((await request('PUT', '/v1/collection/equipped', { body: { animalId: null } })).status, 401);
});

test('coleção nova está vazia, com o leão inicial equipado', async () => {
  const c = await newClient();
  assert.deepEqual((await c.get('/v1/collection')).body.data, { unlockedIds: [], equippedId: null });
});

test('equipa animal desbloqueado e volta ao leão com null', async () => {
  const c = await withOneCard();
  let r = await c.put('/v1/collection/equipped', { animalId: 'rabbit' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { unlockedIds: ['rabbit'], equippedId: 'rabbit' });
  r = await c.put('/v1/collection/equipped', { animalId: null });
  assert.equal(r.body.data.equippedId, null);
});

test('animal bloqueado 409, desconhecido 404, corpo inválido 400', async () => {
  const c = await withOneCard();
  let r = await c.put('/v1/collection/equipped', { animalId: 'frog' });
  assert.equal(r.status, 409);
  assert.equal(r.body.error.code, 'ANIMAL_LOCKED');
  assert.equal((await c.put('/v1/collection/equipped', { animalId: 'dragon' })).status, 404);
  assert.equal((await c.put('/v1/collection/equipped', {})).status, 400);
  assert.equal((await c.put('/v1/collection/equipped', { animalId: 5 })).status, 400);
});

test('unlock: guarda a ordem, ignora repetida, valida animal', async () => {
  assert.equal((await request('POST', '/v1/collection/unlock', { body: { animalId: 'fox' } })).status, 401);
  const c = await newClient();
  await c.post('/v1/collection/unlock', { animalId: 'rabbit' });
  let r = await c.post('/v1/collection/unlock', { animalId: 'fox' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, { unlockedIds: ['rabbit', 'fox'], equippedId: null });
  r = await c.post('/v1/collection/unlock', { animalId: 'rabbit' });
  assert.deepEqual(r.body.data.unlockedIds, ['rabbit', 'fox']);
  assert.equal((await c.post('/v1/collection/unlock', { animalId: 'dragon' })).status, 404);
  assert.equal((await c.post('/v1/collection/unlock', {})).status, 400);
});

test('unlock em paralelo não duplica a carta', async () => {
  const c = await newClient();
  await Promise.all(Array.from({ length: 5 }, () => c.post('/v1/collection/unlock', { animalId: 'cat' })));
  assert.deepEqual((await c.get('/v1/collection')).body.data.unlockedIds, ['cat']);
});
