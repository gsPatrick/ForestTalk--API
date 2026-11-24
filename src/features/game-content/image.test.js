const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');
const env = require('../../config/env');
const content = require('../../providers/content/content.provider');
const { generateImage } = require('./image.generator');
const { GAMES, blockRange } = require('./game-content.constants');
const constants = require('../../config/constants');

// Fixtures temporárias: o conteúdo real de 'image' é gerado em outro fluxo.
const realDir = env.contentDir;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ft-image-'));
let client;

function writeFixtures() {
  const dir = path.join(tmp, 'image');
  fs.mkdirSync(dir, { recursive: true });
  const phases = Array.from({ length: 50 }, (_, p) => ({
    phase: p + 1, globalPhase: 201 + p, chapter: 21 + Math.floor(p / 10), level: 'A1', theme: `t${p + 1}`,
    concepts: Array.from({ length: 10 }, (_, i) => ({ id: `im${String(p + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`, emoji: '🐶', pt: `pt${p}-${i}` })),
  }));
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({ version: 1, phases }));
  for (const code of constants.LANGUAGE_CODES) {
    const entries = {};
    for (const ph of phases) {
      ph.concepts.forEach((c, i) => {
        entries[c.id] = { word: `${code}-${c.id}`, ...(constants.TRANSLIT_LANGUAGE_CODES.includes(code) ? { translit: `tr-${c.id}` } : {}) };
        if (ph.phase === 3 && i === 9) entries[c.id].word = entries[ph.concepts[0].id].word; // texto repetido: distratora deve ser pulada
      });
    }
    fs.writeFileSync(path.join(dir, `${code}.json`), JSON.stringify({ version: 1, entries }));
  }
}

before(async () => {
  writeFixtures();
  env.contentDir = tmp;
  content.clearCache();
  await startServer();
  client = await newClient();
});
after(async () => {
  await stopServer();
  env.contentDir = realDir;
  content.clearCache();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('constantes: 5 jogos, imagem no bloco 4 (201–250), 25 capítulos / 250 fases', () => {
  assert.equal(constants.TOTAL_CHAPTERS, 25);
  assert.equal(constants.TOTAL_PHASES, 250);
  assert.equal(constants.PHASES_PER_GAME, 50);
  assert.deepEqual(GAMES.image, { id: 'image', block: 4, items: 10 });
  assert.deepEqual(blockRange(GAMES.image), [201, 250]);
});

test('gerador: 10 itens, 3 opções únicas, correctIndex válido, translit só quando existe', () => {
  for (const code of constants.LANGUAGE_CODES) {
    const phases = content.getPhases('image', code);
    for (let k = 1; k <= 50; k += 1) {
      const items = generateImage({ languageCode: code, phaseNumber: 200 + k, phase: phases[k - 1] });
      assert.equal(items.length, 10);
      assert.equal(new Set(items.map((i) => i.id)).size, 10);
      const hasTranslit = constants.TRANSLIT_LANGUAGE_CODES.includes(code);
      for (const i of items) {
        assert.equal(i.options.length, 3);
        assert.equal(new Set(i.options.map((o) => o.text)).size, 3);
        assert.ok(i.correctIndex >= 0 && i.correctIndex < 3);
        assert.equal(i.options[i.correctIndex].text, i.studyWord.text);
        for (const o of [i.studyWord, ...i.options]) assert.equal(o.translit !== null, hasTranslit);
        assert.deepEqual(Object.keys(i).sort(), ['correctIndex', 'emoji', 'id', 'options', 'studyWord', 'translation']);
      }
    }
  }
});

test('gerador: determinístico e distratoras vêm da mesma fase', () => {
  const phase = content.getPhases('image', 'ja')[4];
  const a = generateImage({ languageCode: 'ja', phaseNumber: 205, phase });
  const b = generateImage({ languageCode: 'ja', phaseNumber: 205, phase });
  assert.deepEqual(a, b);
  const words = new Set(phase.concepts.map((c) => c.word));
  for (const i of a) for (const o of i.options) assert.ok(words.has(o.text));
  assert.notDeepEqual(a.map((i) => i.id), generateImage({ languageCode: 'en', phaseNumber: 205, phase: content.getPhases('image', 'en')[4] }).map((i) => i.id));
});

test('rota image: 200 com contrato, 400 fora de 201–250, 404 idioma, 401 sem token, ETag', async () => {
  const res = await client.get('/v1/languages/es/phases/201/image');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 10);
  assert.ok(res.headers?.etag ?? true);
  assert.equal((await client.get('/v1/languages/es/phases/250/image')).status, 200);
  for (const n of [200, 251]) {
    const out = await client.get(`/v1/languages/en/phases/${n}/image`);
    assert.equal(out.status, 400);
    assert.equal(out.body.error.code, 'PHASE_OUT_OF_RANGE');
    assert.deepEqual(out.body.error.details, { min: 201, max: 250 });
  }
  assert.equal((await client.get('/v1/languages/en/phases/1/image')).body.error.code, 'PHASE_OUT_OF_RANGE');
  assert.equal((await client.get('/v1/languages/xx/phases/201/image')).status, 404);
  assert.equal((await request('GET', '/v1/languages/en/phases/201/image')).status, 401);
  const again = await client.get('/v1/languages/es/phases/201/image');
  assert.deepEqual(again.body, res.body);
});

test('provider: ausência do arquivo de idioma dá erro claro', () => {
  fs.unlinkSync(path.join(tmp, 'image', 'zh.json'));
  content.clearCache();
  assert.throws(() => content.getPhases('image', 'zh'), /Conteúdo ausente/);
});
