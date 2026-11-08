const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request } = require('../../test/helpers');

before(startServer);
after(stopServer);

test('lista os 5 idiomas sem auth, no formato Language.toJson', async () => {
  const { status, body } = await request('GET', '/v1/languages');
  assert.equal(status, 200);
  assert.deepEqual(body.data.map((l) => l.code), ['en', 'es', 'fr', 'it', 'ru']);
  for (const l of body.data) {
    assert.deepEqual(Object.keys(l).sort(), ['code', 'flagEmoji', 'name', 'nativeName', 'sttLocale', 'ttsLocale', 'usesTransliteration']);
  }
  assert.equal(body.data.find((l) => l.code === 'ru').usesTransliteration, true);
  assert.equal(body.data.find((l) => l.code === 'en').usesTransliteration, false);
});
