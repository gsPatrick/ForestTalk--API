const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer } = require('../../test/helpers');
const { premiumClient, mockOpenAi, aiReply, sendChat: send, restoreFetch } = require('../../test/chat-helpers');
const { ChatUsage } = require('../../models');
const env = require('../../config/env');

before(startServer);
after(stopServer);

const realKey = env.OPENAI_API_KEY;
const realLimit = env.CHAT_DAILY_LIMIT;
afterEach(() => {
  restoreFetch();
  env.OPENAI_API_KEY = realKey;
  env.CHAT_DAILY_LIMIT = realLimit;
});

test('com chave: monta o prompt no servidor e normaliza a resposta da OpenAI', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => aiReply({ text: 'Привет!', translation: 'Oi!', transliteration: 'Privet!' }));
  const c = await premiumClient();
  const res = await send(c, { languageCode: 'ru', text: 'Привет' });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.data, { text: 'Привет!', translation: 'Oi!', transliteration: 'Privet!' });
  assert.equal(calls.length, 1);
  assert.match(calls[0].messages[0].content, /Russian/);
  assert.match(calls[0].messages[0].content, /transliteration/);
  const body = calls[0];
  assert.equal(body.response_format.type, 'json_schema');
  assert.equal(body.response_format.json_schema.strict, true);
  assert.deepEqual(body.response_format.json_schema.schema.required, ['text', 'translation', 'transliteration']);
  assert.equal(body.max_completion_tokens, 300);
  assert.equal(body.max_tokens, undefined);
  assert.match(body.safety_identifier, /^[0-9a-f]{64}$/);
  assert.ok(!body.safety_identifier.includes(c.deviceId));
});

test('OpenAI: 1 retry em 500 e depois sucesso', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi((n) => (n === 1 ? new Response('boom', { status: 500 }) : aiReply({ text: 'Hi!', translation: 'Oi!' })));
  const c = await premiumClient();
  const res = await send(c);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 2);
});

test('OpenAI fora do ar: 502 AI_UNAVAILABLE e a cota é devolvida', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => new Response('down', { status: 503 }));
  const c = await premiumClient();
  const res = await send(c);
  assert.equal(res.status, 502);
  assert.equal(res.body.error.code, 'AI_UNAVAILABLE');
  assert.equal(calls.length, 2);
  const usage = await ChatUsage.findOne({ where: { deviceId: c.deviceId } });
  assert.equal(usage.messages, 0);
  assert.ok(!JSON.stringify(res.body).includes('sk-teste'));
});

test('OpenAI devolve conteúdo inválido: 502 sem retry infinito', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  mockOpenAi(() => new Response(JSON.stringify({ choices: [{ message: { content: 'não é json' } }] }), { status: 200 }));
  const c = await premiumClient();
  assert.equal((await send(c)).status, 502);
});

test('OpenAI recusa (refusal) ou corta por tamanho: 502 e a cota volta', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const c = await premiumClient();
  const wrap = (message, finish = 'stop') => new Response(JSON.stringify({ choices: [{ message, finish_reason: finish }] }), { status: 200 });
  mockOpenAi(() => wrap({ content: null, refusal: 'não posso' }));
  assert.equal((await send(c)).status, 502);
  mockOpenAi(() => wrap({ content: '{"text":"Hi' }, 'length'));
  assert.equal((await send(c)).status, 502);
  assert.equal((await ChatUsage.findOne({ where: { deviceId: c.deviceId } })).messages, 0);
});
