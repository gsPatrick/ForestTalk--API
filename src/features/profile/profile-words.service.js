const { getPhases } = require('../../providers/content/content.provider');
const { GAMES, gamePhaseOf } = require('../game-content/game-content.constants');
const { gameKeyOf } = require('./profile.constants');

/** Palavras das fases concluídas, por fase global e ordem do conceito; 1ª ocorrência de cada `word`. */
function wordsOfPhases(languageCode, phaseNumbers) {
  const seen = new Set();
  const words = [];
  for (const phase of [...phaseNumbers].sort((a, b) => a - b)) {
    const game = gameKeyOf(phase);
    const content = getPhases(GAMES[game].id, languageCode)[gamePhaseOf(phase) - 1];
    for (const c of content.concepts) {
      if (seen.has(c.word)) continue;
      seen.add(c.word);
      words.push({
        id: c.id,
        word: c.word,
        translit: c.translit ?? null,
        pt: c.pt,
        emoji: c.emoji,
        theme: content.theme,
        game,
        phase,
        example: c.example ?? null,
        examplePt: c.examplePt ?? null,
        pron: c.pron ?? null,
      });
    }
  }
  return words;
}

module.exports = { wordsOfPhases };
