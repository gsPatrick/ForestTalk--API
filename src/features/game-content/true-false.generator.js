const { createDartRandom, dartShuffle, DART_LANGUAGE_HASH } = require('../../utils/dart-random');

function wrongFor(concept, all, usedWrong, random) {
  const others = dartShuffle(all.filter((c) => c.id !== concept.id), random);
  const fresh = others.find((c) => !usedWrong.has(c.id)) || others[0];
  usedWrong.add(fresh.id);
  return fresh;
}

/**
 * 10 itens de V/F: 5 verdadeiros + 5 falsos embaralhados. Os falsos mostram a tradução de OUTRO
 * conceito da mesma fase, sem repetir a mesma tradução errada. Determinístico por (fase, idioma).
 */
function generateTrueFalse({ languageCode, phaseNumber, phase }) {
  const { concepts } = phase;
  const count = concepts.length;
  const random = createDartRandom(phaseNumber * 7919 + DART_LANGUAGE_HASH[languageCode]);
  const order = dartShuffle(concepts, random);
  const flags = dartShuffle(Array.from({ length: count }, (_, i) => i < Math.floor(count / 2)), random);
  const usedWrong = new Set();

  return order.map((concept, i) => {
    const isTrue = flags[i];
    const shown = isTrue ? concept : wrongFor(concept, concepts, usedWrong, random);
    return {
      id: `p${phaseNumber}-${i}-${concept.id}`,
      word: concept.word,
      translit: concept.translit ?? null,
      shownTranslation: shown.pt,
      correctTranslation: concept.pt,
      isTrue,
      emoji: concept.emoji,
      example: concept.example ?? null,
      examplePt: concept.examplePt ?? null,
      pron: concept.pron ?? null,
      curiosity: concept.curiosity ?? null,
      theme: phase.theme,
    };
  });
}

module.exports = { generateTrueFalse };
