const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { computeStreaks } = require('./profile-streak');

before(startServer);
after(stopServer);

const done = (c, n, stars) => c.post(`/v1/languages/en/phases/${n}/complete`, { stars, coinsEarned: 10 });

test('exige autenticação e valida idioma', async () => {
  assert.equal((await request('GET', '/v1/languages/en/profile')).status, 401);
  const c = await newClient();
  assert.equal((await c.get('/v1/languages/xx/profile')).status, 400);
});

test('perfil vazio: zeros e sem palavras', async () => {
  const c = await newClient();
  const { status, body } = await c.get('/v1/languages/en/profile');
  assert.equal(status, 200);
  const { stats, words } = body.data;
  assert.deepEqual(words, []);
  assert.equal(stats.phasesCompleted, 0);
  assert.equal(stats.totalPhases, 120);
  assert.equal(stats.maxStars, 360);
  assert.equal(stats.totalChapters, 12);
  assert.equal(stats.chaptersCompleted, 0);
  assert.equal(stats.wordsLearned, 0);
  assert.equal(stats.streakDays, 0);
  assert.equal(stats.bestStreakDays, 0);
  assert.equal(stats.animalsOwned, 1);
  assert.equal(stats.animalsTotal, 12);
  assert.equal(stats.coins, 0);
  assert.equal(stats.isPremium, false);
  assert.deepEqual(Object.keys(stats.perGame), ['true-false', 'pairs', 'translation', 'pronunciation']);
  assert.deepEqual(stats.perGame.pairs, { done: 0, total: 30, stars: 0 });
});

test('após fases 1 e 31: contagens, perGame e palavras sem duplicata', async () => {
  const c = await newClient();
  await done(c, 1, 3);
  await done(c, 31, 2);
  const { stats, words } = (await c.get('/v1/languages/en/profile')).body.data;
  assert.equal(stats.phasesCompleted, 2);
  assert.equal(stats.stars, 5);
  assert.equal(stats.chaptersCompleted, 0);
  assert.deepEqual(stats.perGame['true-false'], { done: 1, total: 30, stars: 3 });
  assert.deepEqual(stats.perGame.pairs, { done: 1, total: 30, stars: 2 });
  assert.equal(stats.perGame.translation.done, 0);
  assert.equal(stats.wordsLearned, words.length);
  assert.ok(words.length > 0);
  assert.equal(new Set(words.map((w) => w.word)).size, words.length);
  assert.equal(words[0].game, 'true-false');
  assert.equal(words[0].phase, 1);
  assert.ok(words.every((w) => w.phase === 1 || w.phase === 31));
  assert.deepEqual(Object.keys(words[0]).sort(),
    ['emoji', 'example', 'examplePt', 'game', 'id', 'phase', 'pron', 'pt', 'theme', 'translit', 'word']);
  assert.equal(stats.streakDays, 1);
  assert.equal(stats.coins, 20);
});

test('capítulo completo conta ao concluir as 10 fases', async () => {
  const c = await newClient();
  for (let n = 1; n <= 10; n++) await done(c, n, 1);
  const { stats } = (await c.get('/v1/languages/en/profile')).body.data;
  assert.equal(stats.chaptersCompleted, 1);
});

test('computeStreaks: hoje, ontem, buraco e vazio', () => {
  assert.deepEqual(computeStreaks([], '2026-05-10'), { current: 0, best: 0 });
  assert.deepEqual(computeStreaks(['2026-05-08', '2026-05-09', '2026-05-10'], '2026-05-10'), { current: 3, best: 3 });
  assert.deepEqual(computeStreaks(['2026-05-08', '2026-05-09'], '2026-05-10'), { current: 2, best: 2 });
  assert.deepEqual(computeStreaks(['2026-05-07', '2026-05-08'], '2026-05-10'), { current: 0, best: 2 });
  assert.deepEqual(computeStreaks(['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-09', '2026-05-09', '2026-05-10'], '2026-05-10'),
    { current: 2, best: 3 });
  assert.deepEqual(computeStreaks(['2026-02-28', '2026-03-01'], '2026-03-01'), { current: 2, best: 2 });
});
