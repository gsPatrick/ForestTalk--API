const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const { premiumClient, sendChat: send, restoreFetch } = require('../../test/chat-helpers');
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

test('401 sem token e 403 PREMIUM_REQUIRED sem assinatura', async () => {
  assert.equal((await request('GET', '/v1/chat/characters')).status, 401);
  const free = await newClient();
  const res = await free.get('/v1/chat/characters');
  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, 'PREMIUM_REQUIRED');
});

test('personagens não expõem a persona do servidor', async () => {
  const c = await premiumClient();
  const res = await c.get('/v1/chat/characters');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 6);
  assert.deepEqual(Object.keys(res.body.data[0]).sort(), ['description', 'emoji', 'id', 'kind', 'name']);
});

test('fallback sem chave: start, sugestões e resposta roteirizada (russo com translit)', async () => {
  env.OPENAI_API_KEY = '';
  const c = await premiumClient();
  const start = await c.post('/v1/chat/start', { characterId: 'fox', languageCode: 'ru' });
  assert.equal(start.status, 200);
  assert.ok(start.body.data.transliteration);
  const sug = await c.get('/v1/chat/suggestions?lang=en&turn=1');
  assert.equal(sug.body.data[0].text, 'I am fine, thank you. And you?');
  const r0 = await send(c, { languageCode: 'en', turn: 0 });
  assert.equal(r0.body.data.text, 'Nice to meet you, Ana! How are you today?');
  const r3 = await send(c, { languageCode: 'en', turn: 3 }); // cicla
  assert.equal(r3.body.data.text, 'Nice to meet you, Ana! How are you today?');
});

test('validação 400: personagem, idioma, texto vazio/longo, turn', async () => {
  const c = await premiumClient();
  assert.equal((await send(c, { characterId: 'dragon' })).status, 400);
  assert.equal((await send(c, { languageCode: 'xx' })).status, 400);
  assert.equal((await send(c, { text: '   ' })).status, 400);
  assert.equal((await send(c, { text: 'a'.repeat(501) })).status, 400);
  assert.equal((await send(c, { turn: -1 })).status, 400);
  assert.equal((await c.post('/v1/chat/start', { characterId: 'fox' })).status, 400);
  assert.equal((await c.get('/v1/chat/suggestions?lang=zz')).status, 400);
});

test('limite diário: 429 CHAT_LIMIT_REACHED com resetAt', async () => {
  env.OPENAI_API_KEY = '';
  env.CHAT_DAILY_LIMIT = 2;
  const c = await premiumClient();
  assert.equal((await send(c)).status, 200);
  assert.equal((await send(c)).status, 200);
  const res = await send(c);
  assert.equal(res.status, 429);
  assert.equal(res.body.error.code, 'CHAT_LIMIT_REACHED');
  assert.ok(res.body.error.details.resetAt);
  const usage = await ChatUsage.findOne({ where: { deviceId: c.deviceId } });
  assert.equal(usage.messages, 2);
});
