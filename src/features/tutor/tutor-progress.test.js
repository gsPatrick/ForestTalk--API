const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, newClient } = require('../../test/helpers');
const { TutorSession } = require('../../models');
const { buildStreak, buildCallTime } = require('./tutor-progress-stats');
const { finishCatchingUp } = require('../../test/tutor-helpers');

before(startServer);
after(stopServer);

test('progresso vazio', async () => {
  const c = await newClient();
  const p = (await c.get('/v1/tutor/progress?languageCode=en')).body.data;
  assert.deepEqual(p.feedback, { grammar: 0, suggestions: 0, pronunciation: 0 });
  assert.deepEqual(p.vocabulary.newWords, []);
  assert.equal(p.vocabulary.newCount, 0);
  assert.ok(p.vocabulary.nextCount > 0);
  assert.deepEqual(p.streak, { current: 0, best: 0, weekDays: Array(7).fill(false) });
  assert.deepEqual(p.callTime, { totalSeconds: 0, dailyAverageSeconds: 0, dailyGoalMinutes: 10, todaySeconds: 0 });
  assert.deepEqual(p.history, []);
});

test('após uma sessão concluída: feedback, vocabulário, sequência, tempo e histórico', async () => {
  const c = await newClient();
  const before = (await c.get('/v1/tutor/progress')).body.data.vocabulary.nextCount;
  await finishCatchingUp(c, 132);
  const p = (await c.get('/v1/tutor/progress?languageCode=en')).body.data;
  assert.equal(p.vocabulary.newCount, 5);
  assert.equal(p.vocabulary.nextCount, before);
  assert.deepEqual(p.streak.current, 1);
  assert.equal(p.streak.best, 1);
  const dow = (new Date().getUTCDay() + 6) % 7;
  assert.equal(p.streak.weekDays[dow], true);
  assert.equal(p.streak.weekDays.filter(Boolean).length, 1);
  assert.deepEqual(p.callTime, { totalSeconds: 132, dailyAverageSeconds: 132, dailyGoalMinutes: 10, todaySeconds: 132 });
  assert.equal(p.history.length, 1);
  assert.deepEqual(Object.keys(p.history[0]).sort(), ['completed', 'durationSeconds', 'id', 'startedAt', 'title']);
  assert.equal(p.history[0].completed, true);
  assert.equal(p.history[0].title, 'Catching Up');
  const es = (await c.get('/v1/tutor/progress?languageCode=es')).body.data;
  assert.equal(es.history.length, 0);
  assert.equal(es.callTime.totalSeconds, 0);
  assert.equal(es.callTime.todaySeconds, 132);
});

test('histórico limitado a 20, mais recentes primeiro; feedback soma as métricas', async () => {
  const c = await newClient();
  const base = { deviceId: c.deviceId, languageCode: 'en', kind: 'free', title: 'Conversa Livre', displayName: 'B', durationSeconds: 60 };
  for (let i = 0; i < 22; i++) {
    await TutorSession.create({ ...base, grammar: 1, suggestions: 2, pronunciation: 3, endedAt: new Date(), startedAt: new Date(Date.now() - i * 86_400_000 - 1000) });
  }
  await TutorSession.create({ ...base, title: 'Aberta' }); // nunca encerrada: fora do histórico
  const p = (await c.get('/v1/tutor/progress')).body.data;
  assert.equal(p.history.length, 20);
  assert.ok(p.history[0].startedAt > p.history[19].startedAt);
  assert.ok(!p.history.some((h) => h.title === 'Aberta'));
  assert.deepEqual(p.feedback, { grammar: 22, suggestions: 44, pronunciation: 66 });
  assert.equal(p.callTime.totalSeconds, 23 * 60);
  assert.ok(p.streak.best >= 22);
});

test('buildStreak: semana segunda→domingo, atual e melhor', () => {
  const now = new Date('2026-11-11T10:00:00Z'); // quarta
  const d = (s) => new Date(`${s}T12:00:00Z`);
  const s = buildStreak([d('2026-11-09'), d('2026-11-11'), d('2026-11-10'), d('2026-10-31'), d('2026-11-01'), d('2026-11-02')], now);
  assert.deepEqual(s.weekDays, [true, true, true, false, false, false, false]);
  assert.equal(s.current, 3);
  assert.equal(s.best, 3);
  // domingo: semana inteira anterior fica fora
  const sun = buildStreak([d('2026-11-09'), d('2026-11-15')], new Date('2026-11-15T23:00:00Z'));
  assert.deepEqual(sun.weekDays, [true, false, false, false, false, false, true]);
  assert.equal(sun.current, 1);
  assert.deepEqual(buildStreak([], now), { current: 0, best: 0, weekDays: Array(7).fill(false) });
  // sem sessão hoje, a sequência de ontem ainda conta
  assert.equal(buildStreak([d('2026-11-09'), d('2026-11-10')], now).current, 2);
});

test('buildCallTime: média por dia estudado', () => {
  const now = new Date('2026-11-11T10:00:00Z');
  const rows = [
    { durationSeconds: 100, startedAt: new Date('2026-11-10T10:00:00Z') },
    { durationSeconds: 50, startedAt: new Date('2026-11-10T11:00:00Z') },
    { durationSeconds: 90, startedAt: new Date('2026-11-11T09:00:00Z') },
  ];
  assert.deepEqual(buildCallTime(rows, rows, now, 15), { totalSeconds: 240, dailyAverageSeconds: 120, dailyGoalMinutes: 15, todaySeconds: 90 });
});
