const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const content = require('../../providers/content/content.provider');
const { generateTrueFalse } = require('./true-false.generator');
const { generatePairs } = require('./pairs.generator');
const { generateTranslation } = require('./translation.generator');
const { isInvertedTranslation } = require('./game-content.constants');

const LANGS = ['en', 'es', 'fr', 'it', 'ru'];
let client;
before(async () => {
  await startServer();
  client = await newClient();
});
after(stopServer);

test('todas as 90 fases x 5 idiomas respeitam os invariantes', () => {
  for (const code of LANGS) {
    const tf = content.getPhases('true_false', code);
    const pr = content.getPhases('pairs', code);
    const tr = content.getPhases('translation', code);
    for (let k = 1; k <= 30; k += 1) {
      const a = generateTrueFalse({ languageCode: code, phaseNumber: k, phase: tf[k - 1] });
      assert.equal(a.length, 10);
      assert.equal(a.filter((i) => i.isTrue).length, 5);
      assert.equal(new Set(a.map((i) => i.id)).size, 10);
      assert.equal(new Set(a.map((i) => i.word)).size, 10);
      for (const i of a) assert.equal(i.isTrue, i.shownTranslation === i.correctTranslation);
      const wrong = a.filter((i) => !i.isTrue).map((i) => i.shownTranslation);
      assert.equal(new Set(wrong).size, 5);

      const b = generatePairs({ phaseNumber: 30 + k, phase: pr[k - 1] });
      assert.equal(b.length, 8);
      assert.equal(new Set(b.map((i) => i.word)).size, 8);
      assert.equal(new Set(b.map((i) => i.translation)).size, 8);

      const n = 60 + k;
      const phase = tr[k - 1];
      const c = generateTranslation({ languageCode: code, phaseNumber: n, phase, chapterPhases: tr.filter((p) => p.chapter === phase.chapter) });
      assert.equal(c.length, 10);
      for (const i of c) {
        assert.equal(i.options.length, 4);
        assert.equal(new Set(i.options.map((o) => o.text)).size, 4);
        assert.equal(i.inverted, isInvertedTranslation(n));
        const expected = i.inverted ? i.studyWord.text : i.translation;
        assert.equal(i.options[i.correctIndex].text, expected);
      }
    }
  }
});

test('geração é determinística', async () => {
  const a = await client.get('/v1/languages/ru/phases/5/true-false');
  const b = await client.get('/v1/languages/ru/phases/5/true-false');
  assert.deepEqual(a.body, b.body);
});

test('rotas devolvem as listas e cabeçalhos de cache', async () => {
  const tf = await client.get('/v1/languages/en/phases/1/true-false');
  assert.equal(tf.status, 200);
  assert.equal(tf.body.data.length, 10);
  assert.ok(tf.body.data[0].shownTranslation !== undefined && tf.body.data[0].theme);
  const pr = await client.get('/v1/languages/es/phases/31/pairs');
  assert.equal(pr.body.data.length, 8);
  const tr = await client.get('/v1/languages/ru/phases/72/translation');
  assert.equal(tr.body.data.length, 10);
  assert.equal(tr.body.data[0].inverted, true);

});

test('ETag/Cache-Control e 304 com If-None-Match', async () => {
  const env = require('../../config/env');
  const server = require('../../../app').listen(0);
  try {
    const url = `http://127.0.0.1:${server.address().port}${env.API_PREFIX}/v1/languages/fr/phases/40/pairs`;
    const headers = { authorization: `Bearer ${client.token}` };
    const first = await fetch(url, { headers });
    const etag = first.headers.get('etag');
    assert.ok(etag);
    assert.match(first.headers.get('cache-control'), /max-age/);
    await first.text();
    // node:http: o fetch (undici) acrescenta Cache-Control: no-cache quando há If-None-Match.
    const status = await new Promise((resolve, reject) => {
      require('node:http').get(url, { headers: { ...headers, 'if-none-match': etag } }, (r) => {
        r.resume();
        resolve(r.statusCode);
      }).on('error', reject);
    });
    assert.equal(status, 304);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('401 sem token, 400 fase fora do bloco, 400 fase inválida, 404 idioma', async () => {
  assert.equal((await request('GET', '/v1/languages/en/phases/1/true-false')).status, 401);
  const out = await client.get('/v1/languages/en/phases/31/true-false');
  assert.equal(out.status, 400);
  assert.equal(out.body.error.code, 'PHASE_OUT_OF_RANGE');
  assert.equal((await client.get('/v1/languages/en/phases/1/pairs')).body.error.code, 'PHASE_OUT_OF_RANGE');
  assert.equal((await client.get('/v1/languages/en/phases/60/translation')).body.error.code, 'PHASE_OUT_OF_RANGE');
  const bad = await client.get('/v1/languages/en/phases/abc/pairs');
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, 'VALIDATION_ERROR');
  const nf = await client.get('/v1/languages/xx/phases/1/true-false');
  assert.equal(nf.status, 404);
  assert.equal(nf.body.error.code, 'LANGUAGE_NOT_FOUND');
});

const hasPronunciation = () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const dir = path.join(require('../../config/env').contentDir, 'pronunciation');
  return fs.existsSync(path.join(dir, 'curriculum.json')) && fs.existsSync(path.join(dir, 'en.json'));
};

test('pronúncia: fora da faixa 91–120 → 400, idioma inválido → 404', async () => {
  const out = await client.get('/v1/languages/en/phases/90/pronunciation');
  assert.equal(out.status, 400);
  assert.equal(out.body.error.code, 'PHASE_OUT_OF_RANGE');
  assert.equal((await client.get('/v1/languages/en/phases/121/pronunciation')).body.error.code, 'PHASE_OUT_OF_RANGE');
  assert.equal((await client.get('/v1/languages/xx/phases/91/pronunciation')).status, 404);
  assert.equal((await request('GET', '/v1/languages/en/phases/91/pronunciation')).status, 401);
});

test('pronúncia: 8 itens na ordem do currículo, com o formato do contrato', async (t) => {
  if (!hasPronunciation()) return t.skip('conteúdo de pronunciation ainda não existe');
  const res = await client.get('/v1/languages/en/phases/91/pronunciation');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 8);
  const phase = content.getPhases('pronunciation', 'en')[0];
  assert.deepEqual(res.body.data.map((i) => i.id), phase.concepts.map((c) => c.id));
  for (const i of res.body.data) {
    assert.deepEqual(Object.keys(i).sort(), ['curiosity', 'emoji', 'example', 'examplePt', 'id', 'pron', 'translation', 'translit', 'word']);
    assert.ok(i.word && i.translation && i.emoji);
  }
});
