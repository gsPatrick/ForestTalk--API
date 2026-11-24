const { createDartRandom, dartShuffle, DART_LANGUAGE_HASH } = require('../../utils/dart-random');

const studied = (c) => ({ text: c.word, translit: c.translit ?? null });

/** 2 distratoras de OUTROS conceitos da mesma fase, sem texto repetido nem igual ao da correta. */
function pickDistractors(others, correct, random) {
  const seen = new Set([correct.text]);
  const picked = [];
  for (const other of dartShuffle(others, random)) {
    const option = studied(other);
    if (seen.has(option.text)) continue;
    seen.add(option.text);
    picked.push(option);
    if (picked.length === 2) break;
  }
  return picked;
}

/** 10 itens (um por conceito, ordem embaralhada): emoji + 3 opções no idioma estudado. */
function generateImage({ languageCode, phaseNumber, phase }) {
  const random = createDartRandom(phaseNumber * 15485863 + DART_LANGUAGE_HASH[languageCode]);
  return dartShuffle(phase.concepts, random).map((c, i) => {
    const correct = studied(c);
    const others = phase.concepts.filter((o) => o.id !== c.id);
    const options = dartShuffle([correct, ...pickDistractors(others, correct, random)], random);
    return {
      id: `p${phaseNumber}-${i}-${c.id}`,
      emoji: c.emoji,
      studyWord: correct,
      translation: c.pt,
      options,
      correctIndex: options.indexOf(correct),
    };
  });
}

module.exports = { generateImage };
