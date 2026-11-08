const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer } = require('../../test/helpers');
const { premiumClient, mockOpenAi, aiReply, sendChat, restoreFetch } = require('../../test/chat-helpers');
const { ChatMessage } = require('../../models');
const env = require('../../config/env');
const { pickVocabulary } = require('./chat-vocabulary');

before(startServer);
after(stopServer);

const realKey = env.OPENAI_API_KEY;
afterEach(() => {
  restoreFetch();
  env.OPENAI_API_KEY = realKey;
});

const reply = (text) => aiReply({ text, translation: `pt:${text}` });
const stored = (c, where = {}) => ChatMessage.findAll({ where: { deviceId: c.deviceId, ...where }, order: [['id', 'ASC']] });

test('memória: a IA recebe as falas anteriores e a conversa fica guardada', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi((n) => reply(`resposta ${n}`));
  const c = await premiumClient();
  await c.post('/v1/chat/start', { characterId: 'fox', languageCode: 'en' });
  await sendChat(c, { text: 'My name is Ana' });
  await sendChat(c, { text: 'I like cats', turn: 1 });

  const msgs = calls[2].messages; // 0 = start, 1 = 1ª troca, 2 = 2ª troca
  assert.equal(msgs[0].role, 'system');
  assert.deepEqual(msgs.slice(1).map((m) => m.role), ['assistant', 'user', 'assistant', 'user']);
  assert.match(msgs[2].content, /My name is Ana/);
  assert.match(msgs[3].content, /resposta 2/);
  assert.match(msgs[4].content, /I like cats/);
  assert.deepEqual((await stored(c)).map((m) => m.role), ['ai', 'user', 'ai', 'user', 'ai']);
});

test('start reinicia a conversa daquele personagem/idioma e não mexe nas outras', async () => {
  env.OPENAI_API_KEY = '';
  const c = await premiumClient();
  await c.post('/v1/chat/start', { characterId: 'fox', languageCode: 'en' });
  await sendChat(c);
  await c.post('/v1/chat/start', { characterId: 'bear', languageCode: 'en' });
  assert.equal((await stored(c, { characterId: 'fox' })).length, 3);
  await c.post('/v1/chat/start', { characterId: 'fox', languageCode: 'en' });
  assert.equal((await stored(c, { characterId: 'fox' })).length, 1);
  assert.equal((await stored(c, { characterId: 'bear' })).length, 1);
});

test('limites: no prompt vão só as últimas 6 trocas; no banco ficam só 40 mensagens', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => reply('ok'));
  const c = await premiumClient();
  for (let i = 0; i < 22; i += 1) assert.equal((await sendChat(c, { text: `fala ${i}`, turn: i })).status, 200);
  assert.equal(calls.at(-1).messages.length, 1 + 12 + 1);
  assert.match(calls.at(-1).messages.at(-1).content, /fala 21/);
  assert.equal((await stored(c)).length, 40);
});

test('falha da IA não grava nada na memória', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  mockOpenAi(() => new Response('down', { status: 503 }));
  const c = await premiumClient();
  assert.equal((await sendChat(c)).status, 502);
  assert.equal((await stored(c)).length, 0);
});

test('sem chave (roteiro de teste) também guarda a conversa', async () => {
  env.OPENAI_API_KEY = '';
  const c = await premiumClient();
  await sendChat(c);
  assert.deepEqual((await stored(c)).map((m) => m.role), ['user', 'ai']);
});

test('RAG: o prompt leva o nível e o vocabulário das fases concluídas', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => reply('ok'));
  const c = await premiumClient();
  await c.post('/v1/languages/en/phases/1/complete', { stars: 3, coinsEarned: 10 });
  await sendChat(c, { text: 'I saw a donkey today' });
  const system = calls[0].messages[0].content;
  assert.match(system, /CEFR A1/);
  assert.match(system, /donkey \(burro\)/, 'a palavra citada vem primeiro');
  assert.ok(system.indexOf('donkey (burro)') < system.indexOf('cow (vaca)'));
  assert.doesNotMatch(system, /wolf/, 'fase 2 ainda não foi estudada');
});

test('RAG: sem progresso usa as palavras da 1ª fase; o idioma muda o vocabulário', async () => {
  env.OPENAI_API_KEY = 'sk-teste';
  const calls = mockOpenAi(() => reply('ok'));
  const c = await premiumClient();
  await sendChat(c, { languageCode: 'es', text: 'Hola' });
  assert.match(calls[0].messages[0].content, /Words the learner already studied/);
  assert.match(calls[0].messages[0].content, /\(vaca\)/);
});

test('pickVocabulary: citadas primeiro, sem repetir, respeitando o limite', () => {
  const pool = [
    { id: 'a', word: 'cow', pt: 'vaca' },
    { id: 'b', word: 'pig', pt: 'porco' },
    { id: 'c', word: 'duck', pt: 'pato' },
    { id: 'a', word: 'cow', pt: 'vaca' },
  ];
  // pig e duck foram citados (empate: vale a ordem do pool, do mais recente ao mais antigo); cow fica de fora.
  assert.deepEqual(pickVocabulary(pool, 'um PATO e um porco', 2), [
    { word: 'pig', pt: 'porco' },
    { word: 'duck', pt: 'pato' },
  ]);
  assert.equal(pickVocabulary(pool, '', 10).length, 3);
  assert.deepEqual(pickVocabulary([], 'oi'), []);
});
