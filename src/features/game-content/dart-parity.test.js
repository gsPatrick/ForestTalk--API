const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getPhaseItems } = require('./game-content.service');
const golden = require('./dart-golden.json');

// `dart-golden.json` foi gerado pelo próprio app (MockGameContentRepository, Dart VM): a API deve
// devolver os mesmos itens, na mesma ordem, com os mesmos distratores. Veja Registro em ConteudoJogos.md.
const kindOf = (n) => (n <= 30 ? 'true-false' : n <= 60 ? 'pairs' : 'translation');
const view = {
  'true-false': (i) => [i.id, i.isTrue, i.shownTranslation],
  pairs: (i) => i.id,
  translation: (i) => [i.id, i.correctIndex, i.options.map((o) => o.text)],
};

for (const [key, expected] of Object.entries(golden)) {
  const [lang, n] = key.split('/');
  test(`ordem idêntica à do app: ${key}`, () => {
    const kind = kindOf(Number(n));
    const got = getPhaseItems(kind, lang, Number(n)).items.map(view[kind]);
    assert.deepEqual(got, expected);
  });
}
