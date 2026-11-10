const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { create, turn } = require('../../test/tutor-helpers');

before(startServer);
after(stopServer);

test('trilha inicial: Catching Up disponível, demais bloqueadas, tópicos', async () => {
  const c = await newClient();
  const { status, body } = await c.get('/v1/tutor/lessons?languageCode=en');
  assert.equal(status, 200);
  assert.equal(body.data.level, 'Avançado');
  assert.deepEqual(body.data.lessons.map((l) => [l.title, l.status, l.order]), [
    ['Catching Up', 'available', 1],
    ['Weekend Getaway', 'locked', 2],
    ["That's So True", 'locked', 3],
    ['Spending Free Time', 'locked', 4],
  ]);
  assert.deepEqual(Object.keys(body.data.lessons[0]).sort(), ['icon', 'id', 'order', 'status', 'title']);
  assert.equal(body.data.topics.length, 5);
  assert.equal(body.data.topics[0].title, 'Public Opinions');
  for (const code of ['es', 'fr', 'it', 'ru']) {
    const r = await c.get(`/v1/tutor/lessons?languageCode=${code}`);
    assert.equal(r.body.data.lessons[0].status, 'available', code);
  }
  assert.equal((await c.get('/v1/tutor/lessons?languageCode=xx')).status, 400);
});

test('sessão de Catching Up pela API e desbloqueio da próxima aula', async () => {
  const c = await newClient();
  const { status, body } = await create(c, { lessonId: 'catching-up' });
  assert.equal(status, 200);
  const s = body.data;
  assert.equal(s.lessonId, 'catching-up');
  assert.equal(s.title, 'Catching Up');
  assert.equal(s.done, false);
  assert.deepEqual(s.metrics, { grammar: 0, suggestions: 0, pronunciation: 0 });
  assert.equal(s.messages.length, 1);
  assert.match(s.messages[0].text, /^Oi, Bruno! Como está o seu dia/);
  assert.equal(s.messages[0].role, 'tutor');
  assert.ok(s.messages[0].id);

  const t1 = (await turn(c, s.id, 'Estou bem', 'text')).body.data;
  assert.equal(t1.step, 'lesson');
  assert.equal(t1.messages.length, 3);
  const t2 = (await turn(c, s.id, 'não')).body.data;
  assert.equal(t2.step, 'practice');
  assert.equal(t2.messages[1].type, 'exercise');
  assert.notEqual(t1.messages[0].id, t2.messages[0].id);
  const bad = (await turn(c, s.id, 'xyz')).body.data;
  assert.equal(bad.metrics.suggestions, 1);
  const wrong = (await turn(c, s.id, 'B')).body.data;
  assert.equal(wrong.metrics.grammar, 1);
  const end = (await turn(c, s.id, 'reconnect')).body.data;
  assert.equal(end.done, true);
  assert.deepEqual(end.metrics, { grammar: 1, suggestions: 1, pronunciation: 0 });
  assert.equal((await turn(c, s.id, 'A')).status, 409);

  const done = (await c.post(`/v1/tutor/sessions/${s.id}/complete`, { durationSeconds: 90, completed: true })).body.data;
  assert.deepEqual(done.report, {
    grammar: 1, suggestions: 1, pronunciation: 0,
    newWords: ['reconnect', 'reschedule', 'postpone', 'coordinate', 'availability'],
  });
  assert.equal(done.unlockedLessonId, 'weekend-getaway');
  const lessons = (await c.get('/v1/tutor/lessons?languageCode=en')).body.data.lessons;
  assert.deepEqual(lessons.map((l) => l.status), ['completed', 'available', 'locked', 'locked']);
});

test('aula bloqueada recusa; aula inexistente 404; sessão de outro aparelho 404', async () => {
  const c = await newClient();
  const locked = await create(c, { lessonId: 'weekend-getaway' });
  assert.equal(locked.status, 403);
  assert.equal(locked.body.error.code, 'LESSON_LOCKED');
  assert.equal((await create(c, { lessonId: 'nope' })).status, 404);
  const mine = (await create(c, { lessonId: 'catching-up' })).body.data;
  const other = await newClient();
  assert.equal((await turn(other, mine.id, 'oi')).status, 404);
  assert.equal((await turn(c, 'not-a-uuid', 'oi')).status, 400);
});

test('sair antes do fim: sem relatório, sem desbloqueio', async () => {
  const c = await newClient();
  const s = (await create(c, { lessonId: 'catching-up' })).body.data;
  const r = await c.post(`/v1/tutor/sessions/${s.id}/complete`, { durationSeconds: 30, completed: false });
  assert.deepEqual(r.body.data, { report: null, unlockedLessonId: null });
  // completed=true sem terminar o roteiro também não conta
  const s2 = (await create(c, { lessonId: 'catching-up' })).body.data;
  const r2 = await c.post(`/v1/tutor/sessions/${s2.id}/complete`, { durationSeconds: 30, completed: true });
  assert.deepEqual(r2.body.data, { report: null, unlockedLessonId: null });
  assert.equal((await c.get('/v1/tutor/lessons')).body.data.lessons[0].status, 'available');
  assert.equal((await turn(c, s.id, 'oi')).status, 409);
});

test('outros idiomas: aula no idioma correto', async () => {
  const c = await newClient();
  const s = (await create(c, { languageCode: 'es', lessonId: 'saludos', displayName: 'Ana' })).body.data;
  assert.match(s.messages[0].text, /^¡Hola, Ana!/);
  const ru = (await create(c, { languageCode: 'ru', lessonId: 'privetstviya' })).body.data;
  assert.match(ru.messages[0].text, /^Привет, Bruno!/);
});
