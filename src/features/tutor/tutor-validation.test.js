const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { create, turn } = require('../../test/tutor-helpers');

before(startServer);
after(stopServer);

test('exige autenticação', async () => {
  for (const [m, p] of [['GET', '/v1/tutor/lessons'], ['POST', '/v1/tutor/sessions'], ['GET', '/v1/tutor/progress'], ['PUT', '/v1/tutor/settings']]) {
    assert.equal((await request(m, p)).status, 401, p);
  }
});

test('validação do corpo', async () => {
  const c = await newClient();
  assert.equal((await c.post('/v1/tutor/sessions', { languageCode: 'en' })).status, 400);
  assert.equal((await create(c, { languageCode: 'zz' })).status, 400);
  assert.equal((await create(c, { topic: 'a', scenario: 'b' })).status, 400);
  const s = (await create(c, { lessonId: 'catching-up' })).body.data;
  assert.equal((await turn(c, s.id, '')).status, 400);
  assert.equal((await turn(c, s.id, 'oi', 'fax')).status, 400);
  const bad = await c.post(`/v1/tutor/sessions/${s.id}/complete`, { durationSeconds: -1, completed: true });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, 'VALIDATION_ERROR');
  assert.equal((await c.post(`/v1/tutor/sessions/${s.id}/complete`, { durationSeconds: 5 })).status, 400);
});

test('meta diária: padrão 10, valores válidos e inválidos', async () => {
  const c = await newClient();
  assert.deepEqual((await c.get('/v1/tutor/settings')).body.data, { dailyGoalMinutes: 10 });
  assert.equal((await c.get('/v1/tutor/progress')).body.data.callTime.dailyGoalMinutes, 10);
  for (const n of [5, 10, 15, 20, 30]) {
    const r = await c.put('/v1/tutor/settings', { dailyGoalMinutes: n });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body.data, { dailyGoalMinutes: n });
  }
  assert.equal((await c.get('/v1/tutor/progress')).body.data.callTime.dailyGoalMinutes, 30);
  for (const bad of [0, 7, 45, -5, '10', null, 10.5]) {
    assert.equal((await c.put('/v1/tutor/settings', { dailyGoalMinutes: bad })).status, 400, String(bad));
  }
  assert.equal((await c.put('/v1/tutor/settings', {})).status, 400);
  assert.equal((await c.get('/v1/tutor/settings')).body.data.dailyGoalMinutes, 30);
  const other = await newClient();
  assert.equal((await other.get('/v1/tutor/settings')).body.data.dailyGoalMinutes, 10);
});
