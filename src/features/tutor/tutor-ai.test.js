const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, newClient } = require('../../test/helpers');
const { mockOpenAi, aiReply, restoreFetch } = require('../../test/chat-helpers');
const { create, turn } = require('../../test/tutor-helpers');
const env = require('../../config/env');

before(startServer);
after(stopServer);
const realKey = env.OPENAI_API_KEY;
afterEach(() => {
  restoreFetch();
  env.OPENAI_API_KEY = realKey;
});

test('conversa livre sem chave: fallback simples e métricas zeradas', async () => {
  env.OPENAI_API_KEY = '';
  const c = await newClient();
  const free = (await create(c)).body.data;
  assert.equal(free.lessonId, null);
  assert.equal(free.title, 'Conversa Livre');
  const t = (await turn(c, free.id, 'I like music')).body.data;
  assert.equal(t.done, false);
  assert.equal(t.step, 'practice');
  assert.equal(t.messages[0].role, 'tutor');
  assert.ok(t.messages[0].text.length > 0);
  const topic = (await create(c, { topic: 'Negotiations' })).body.data;
  assert.equal(topic.title, 'Negotiations');
  const scn = (await create(c, { scenario: 'Pedir um café' })).body.data;
  assert.equal(scn.title, 'Pedir um café');
});

test('conversa livre com chave: usa o modelo; falha do modelo cai no fallback', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => aiReply({ reply: 'Nice! What kind?', correction: 'Use "I like".', grammarIssues: 1, suggestions: 2 }));
  const c = await newClient();
  const s = (await create(c, { topic: 'Negotiations' })).body.data;
  const t = (await turn(c, s.id, 'I likes music')).body.data;
  assert.deepEqual(t.messages.map((m) => [m.type, m.text]), [['text', 'Nice! What kind?'], ['feedback', 'Use "I like".']]);
  assert.deepEqual(t.metrics, { grammar: 1, suggestions: 2, pronunciation: 0 });
  assert.equal(calls.length, 1);
  assert.match(calls[0].messages[0].content, /Negotiations/);
  restoreFetch();
  mockOpenAi(() => new Response('{}', { status: 400 }));
  const fb = (await turn(c, s.id, 'And you?')).body.data;
  assert.equal(fb.messages.length, 1);
  assert.equal(fb.messages[0].type, 'text');
  assert.equal(fb.metrics.grammar, 1);
  restoreFetch();
});
