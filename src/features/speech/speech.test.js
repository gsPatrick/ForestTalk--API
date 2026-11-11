const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const env = require('../../config/env');
const { Subscription } = require('../../models');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

const realFetch = global.fetch;
before(startServer);
after(async () => {
  global.fetch = realFetch;
  await stopServer();
});
beforeEach(() => {
  env.ELEVENLABS_API_KEY = 'xi-teste';
  env.ELEVENLABS_VOICE_ID = 'voz123';
});

async function premiumClient() {
  const c = await newClient();
  await Subscription.upsert({ deviceId: c.deviceId, status: 'active', source: 'test' });
  return c;
}

function mockEleven(response) {
  const calls = [];
  global.fetch = async (url, init) => {
    if (!String(url).startsWith('https://api.elevenlabs.io')) return realFetch(url, init);
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    return response();
  };
  return calls;
}

test('exige token (401) e Premium (403)', async () => {
  assert.equal((await request('POST', '/v1/speech', { body: { text: 'Hi', languageCode: 'en' } })).status, 401);
  const free = await newClient();
  assert.equal((await free.post('/v1/speech', { text: 'Hi', languageCode: 'en' })).status, 403);
});

test('valida texto e idioma (400)', async () => {
  const c = await premiumClient();
  for (const body of [{ languageCode: 'en' }, { text: '  ', languageCode: 'en' }, { text: 'a'.repeat(301), languageCode: 'en' }, { text: 'Hi', languageCode: 'xx' }]) {
    assert.equal((await c.post('/v1/speech', body)).status, 400);
  }
});

test('sem chave ou voz: 503 SPEECH_NOT_CONFIGURED (o app usa a voz do aparelho)', async () => {
  env.ELEVENLABS_API_KEY = '';
  const c = await premiumClient();
  const r = await c.post('/v1/speech', { text: 'Hello', languageCode: 'en' });
  assert.equal(r.status, 503);
  assert.equal(r.body.error.code, 'SPEECH_NOT_CONFIGURED');
});

test('com chave: chama o ElevenLabs com a docs e devolve o MP3', async () => {
  const calls = mockEleven(() => new Response(Buffer.from([1, 2, 3, 4]), { status: 200 }));
  const c = await premiumClient();
  const r = await c.post('/v1/speech', { text: 'Привет', languageCode: 'ru' });
  assert.equal(r.status, 200);
  assert.equal(r.type, 'audio/mpeg');
  assert.deepEqual([...r.body], [1, 2, 3, 4]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/v1\/text-to-speech\/voz123\?output_format=mp3_44100_128$/);
  assert.equal(calls[0].init.headers['xi-api-key'], 'xi-teste');
  assert.deepEqual(calls[0].body, { text: 'Привет', model_id: 'eleven_v4' });
});

test('ElevenLabs fora do ar: 502 SPEECH_UNAVAILABLE sem vazar a chave', async () => {
  mockEleven(() => new Response('down', { status: 500 }));
  const c = await premiumClient();
  const r = await c.post('/v1/speech', { text: 'Hello', languageCode: 'en' });
  assert.equal(r.status, 502);
  assert.equal(r.body.error.code, 'SPEECH_UNAVAILABLE');
  assert.ok(!JSON.stringify(r.body).includes('xi-teste'));
});

test('cada personagem fala com a própria voz; sem personagem usa a padrão', async () => {
  const c = await premiumClient();
  const calls = mockEleven(() => new Response(Buffer.from([1, 2, 3]), { status: 200 }));
  assert.equal((await c.post('/v1/speech', { text: 'Hi', languageCode: 'en', characterId: 'bear' })).status, 200);
  assert.equal((await c.post('/v1/speech', { text: 'Hi', languageCode: 'en' })).status, 200);
  assert.match(calls[0].url, /text-to-speech\/nPczCjzI2devNBz1zQrb/);
  assert.deepEqual(calls[0].body.voice_settings, { stability: 0.5, similarity_boost: 0.75, speed: 0.95 });
  assert.equal(calls[0].body.model_id, 'eleven_v4');
  assert.match(calls[1].url, /text-to-speech\/voz123/);
  assert.equal(calls[1].body.voice_settings, undefined);
  assert.equal((await c.post('/v1/speech', { text: 'Hi', languageCode: 'en', characterId: 'dragao' })).status, 400);
});

test('os 13 professores do tutor têm voz própria, todas diferentes', async () => {
  const { CHARACTER_VOICES } = require('../../providers/elevenlabs/character-voices');
  const ids = ['teacher_marina', 'teacher_carlos', 'lion', 'cat', 'dog', 'rabbit', 'elephant', 'giraffe', 'horse', 'kangaroo', 'fox', 'owl', 'bear'];
  const voices = ids.map((id) => CHARACTER_VOICES[id]?.voice);
  assert.ok(voices.every(Boolean));
  assert.equal(new Set(voices).size, ids.length);
  const c = await premiumClient();
  mockEleven(() => new Response(Buffer.from([1]), { status: 200 }));
  for (const id of ids) assert.equal((await c.post('/v1/speech', { text: 'Hi', languageCode: 'en', characterId: id })).status, 200, id);
});
