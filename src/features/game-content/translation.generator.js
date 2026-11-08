const { createDartRandom, dartShuffle, DART_LANGUAGE_HASH } = require('../../utils/dart-random');
const { dartSort } = require('../../utils/dart-sort');
const { isInvertedTranslation } = require('./game-content.constants');

const studied = (c) => ({ text: c.word, translit: c.translit ?? null });
const portuguese = (c) => ({ text: c.pt, translit: null });

/** Distratores: outras fases do mesmo capítulo; comprimento parecido (±3 não pesa) e fase mais próxima. */
function pickDistractors(others, correct, optionOf, random) {
  const cost = (e) => {
    const gap = Math.abs(optionOf(e.concept).text.length - correct.text.length);
    return (gap > 3 ? gap - 3 : 0) * 10 + e.distance;
  };
  const ranked = dartSort(dartShuffle(others, random), (a, b) => cost(a) - cost(b)); // sort do Dart (instável)
  const seen = new Set([correct.text]);
  const picked = [];
  for (const entry of ranked) {
    const option = optionOf(entry.concept);
    if (!seen.has(option.text)) {
      seen.add(option.text);
      picked.push(option);
    }
    if (picked.length === 3) break;
  }
  return picked;
}

/** 10 desafios (um por conceito), 4 opções cada. `chapterPhases` = fases do mesmo capítulo (inclui a atual). */
function generateTranslation({ languageCode, phaseNumber, phase, chapterPhases }) {
  const random = createDartRandom(phaseNumber * 15485863 + DART_LANGUAGE_HASH[languageCode]);
  const inverted = isInvertedTranslation(phaseNumber);
  const optionOf = inverted ? studied : portuguese;
  const answers = dartShuffle(phase.concepts, random);
  const others = chapterPhases
    .filter((p) => p.phase !== phase.phase)
    .flatMap((p) => p.concepts.map((concept) => ({ concept, distance: Math.abs(p.phase - phase.phase) })));

  return answers.map((c, i) => {
    const correct = optionOf(c);
    const options = dartShuffle([correct, ...pickDistractors(others, correct, optionOf, random)], random);
    return {
      id: `p${phaseNumber}-${i}-${c.id}`,
      prompt: inverted ? portuguese(c) : studied(c),
      options,
      correctIndex: options.indexOf(correct),
      emoji: c.emoji,
      studyWord: studied(c),
      translation: c.pt,
      inverted,
      example: c.example ?? null,
      examplePt: c.examplePt ?? null,
      pron: c.pron ?? null,
      curiosity: c.curiosity ?? null,
    };
  });
}

module.exports = { generateTranslation };
