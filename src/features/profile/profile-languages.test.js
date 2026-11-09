const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

const done = (c, lang, n, stars) => c.post(`/v1/languages/${lang}/phases/${n}/complete`, { stars, coinsEarned: 10 });

test('exige autenticação', async () => {
  assert.equal((await request('GET', '/v1/profile/languages')).status, 401);
});

test('aparelho vazio: 5 idiomas zerados na ordem', async () => {
  const c = await newClient();
  const { status, body } = await c.get('/v1/profile/languages');
  assert.equal(status, 200);
  assert.deepEqual(body.data.map((l) => l.code), ['en', 'es', 'fr', 'it', 'ru']);
  for (const l of body.data) {
    assert.deepEqual({ ...l, code: undefined }, {
      code: undefined, phasesCompleted: 0, totalPhases: 120, stars: 0, maxStars: 360,
      wordsLearned: 0, chaptersCompleted: 0, lastPlayedAt: null,
    });
  }
});

test('após fases em en e es: números batem com /languages/:code/profile', async () => {
  const c = await newClient();
  await done(c, 'en', 1, 3);
  await done(c, 'en', 31, 2);
  await done(c, 'es', 1, 1);
  const list = (await c.get('/v1/profile/languages')).body.data;
  const [en, es, fr] = list;
  assert.equal(en.phasesCompleted, 2);
  assert.equal(en.stars, 5);
  assert.equal(es.phasesCompleted, 1);
  assert.equal(es.stars, 1);
  assert.equal(fr.phasesCompleted, 0);
  assert.equal(fr.lastPlayedAt, null);
  assert.ok(!Number.isNaN(Date.parse(en.lastPlayedAt)));
  for (const l of [en, es]) {
    const p = (await c.get(`/v1/languages/${l.code}/profile`)).body.data;
    assert.equal(l.wordsLearned, p.words.length);
    assert.ok(l.wordsLearned > 0);
    assert.equal(l.chaptersCompleted, p.stats.chaptersCompleted);
  }
});
