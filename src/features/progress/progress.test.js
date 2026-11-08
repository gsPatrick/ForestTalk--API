const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

const done = (c, n, stars = 3, coinsEarned = 10) =>
  c.post(`/v1/languages/en/phases/${n}/complete`, { stars, coinsEarned });
async function finish(c, upTo) {
  for (let n = 1; n <= upTo; n++) assert.equal((await done(c, n)).status, 200);
}

test('exige autenticação', async () => {
  assert.equal((await request('GET', '/v1/languages/en/chapters')).status, 401);
  assert.equal((await request('GET', '/v1/languages/en/progress')).status, 401);
  assert.equal((await request('POST', '/v1/languages/en/phases/1/complete', { body: { stars: 3, coinsEarned: 10 } })).status, 401);
  assert.equal((await request('POST', '/v1/languages/en/chests/5/open', { body: { coins: 30 } })).status, 401);
});

test('valida idioma, fase, estrelas e baú (400)', async () => {
  const c = await newClient();
  assert.equal((await c.get('/v1/languages/xx/chapters')).status, 400);
  assert.equal((await done(c, 121)).status, 400);
  assert.equal((await done(c, 0)).status, 400);
  assert.equal((await done(c, 1, 4)).status, 400);
  assert.equal((await c.post('/v1/languages/en/chests/7/open', { coins: 30 })).status, 400);
  assert.equal((await c.post('/v1/languages/en/chests/5/open', {})).status, 400);
  assert.equal((await done(c, 1, 3, -1)).status, 400);
  assert.equal((await c.post('/v1/languages/en/phases/1/complete', { stars: 3 })).status, 400);
});

test('capítulos novos: 12 capítulos, a 1ª fase de cada jogo liberada, tipos de jogo por bloco', async () => {
  const c = await newClient();
  const { status, body } = await c.get('/v1/languages/en/chapters');
  assert.equal(status, 200);
  assert.equal(body.data.length, 12);
  const phases = body.data.flatMap((ch) => ch.phases);
  assert.equal(phases.length, 120);
  assert.deepEqual(phases.filter((p) => p.status === 'available').map((p) => p.number), [1, 31, 61, 91]);
  assert.deepEqual(phases[0], { id: 'p001', number: 1, chapterNumber: 1, gameType: 'true_false', status: 'available', stars: 0 });
  assert.equal(phases[30].gameType, 'pairs');
  assert.equal(phases[60].gameType, 'translation');
  assert.equal(phases[90].gameType, 'pronunciation');
  assert.equal(body.data[11].theme, 'parrot');
  assert.deepEqual(body.data[0].chests, [
    { afterPhaseNumber: 5, tier: 'small', opened: false },
    { afterPhaseNumber: 10, tier: 'big', opened: false },
  ]);
  assert.equal(body.data[0].theme, 'fox');
});

test('progresso inicial e conclusão: soma o coinsEarned do app, estrelas só sobem', async () => {
  const c = await newClient();
  const first = (await c.get('/v1/languages/en/progress')).body.data;
  assert.deepEqual(first, { currentLives: 3, maxLives: 3, coins: 0, isPremium: false, completedPhases: {}, openedChests: [] });

  let r = await done(c, 1, 2, 10);
  assert.equal(r.body.data.coins, 10);
  assert.equal(r.body.data.completedPhases['1'], 2);

  r = await done(c, 1, 1, 0);
  assert.equal(r.body.data.completedPhases['1'], 2, 'estrelas não diminuem');
  r = await done(c, 1, 3, 0);
  assert.equal(r.body.data.completedPhases['1'], 3);
  assert.equal(r.body.data.coins, 10);

  const chapters = (await c.get('/v1/languages/en/chapters')).body.data;
  assert.equal(chapters[0].phases[0].status, 'completed');
  assert.equal(chapters[0].phases[1].status, 'available');
});

test('modo demonstração: conclui qualquer fase; progresso é por idioma e moedas são globais', async () => {
  const c = await newClient();
  assert.equal((await done(c, 40)).status, 200);
  await done(c, 1);
  const es = (await c.get('/v1/languages/es/progress')).body.data;
  assert.deepEqual(es.completedPhases, {});
  assert.equal(es.coins, 20);
});

test('baú: abre uma vez e soma as moedas enviadas; carta e power-ups vêm por rotas próprias', async () => {
  const c = await newClient();
  let r = await c.post('/v1/languages/en/chests/5/open', { coins: 30 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data.openedChests, [5]);
  assert.equal(r.body.data.coins, 30);

  r = await c.post('/v1/languages/en/chests/5/open', { coins: 30 });
  assert.equal(r.status, 409);
  assert.equal(r.body.error.code, 'CHEST_ALREADY_OPENED');

  assert.deepEqual((await c.get('/v1/wallet')).body.data, { coins: 30, powerUps: { fifty: 2, hint: 2 } });
  assert.deepEqual((await c.get('/v1/collection')).body.data, { unlockedIds: [], equippedId: null });
  const chapters = (await c.get('/v1/languages/en/chapters')).body.data;
  assert.equal(chapters[0].chests[0].opened, true);
  assert.equal(chapters[0].chests[1].opened, false);
});

test('baús abertos em paralelo: só um vence e as moedas entram uma vez', async () => {
  const c = await newClient();
  const rs = await Promise.all(Array.from({ length: 5 }, () => c.post('/v1/languages/en/chests/5/open', { coins: 30 })));
  assert.equal(rs.filter((r) => r.status === 200).length, 1);
  assert.equal((await c.get('/v1/wallet')).body.data.coins, 30);
});
