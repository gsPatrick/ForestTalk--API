const AppError = require('../../utils/app-error');
const { LANGUAGE_CODES } = require('../../config/constants');
const content = require('../../providers/content/content.provider');
const { GAMES, gamePhaseOf, blockRange } = require('./game-content.constants');
const { generateTrueFalse } = require('./true-false.generator');
const { generatePairs } = require('./pairs.generator');
const { generateTranslation } = require('./translation.generator');
const { generatePronunciation } = require('./pronunciation.generator');

const build = {
  'true-false': ({ languageCode, phaseNumber, phase }) => generateTrueFalse({ languageCode, phaseNumber, phase }),
  pairs: ({ phaseNumber, phase }) => generatePairs({ phaseNumber, phase }),
  translation: ({ languageCode, phaseNumber, phases, phase }) =>
    generateTranslation({
      languageCode,
      phaseNumber,
      phase,
      chapterPhases: phases.filter((p) => p.chapter === phase.chapter),
    }),
  pronunciation: ({ phase }) => generatePronunciation({ phase }),
};

/** Itens prontos da fase global `phaseNumber` para o jogo `kind` ('true-false' | 'pairs' | 'translation' | 'pronunciation'). */
function getPhaseItems(kind, languageCode, phaseNumber) {
  if (!LANGUAGE_CODES.includes(languageCode)) throw AppError.notFound('Idioma não encontrado', 'LANGUAGE_NOT_FOUND');
  const game = GAMES[kind];
  const [first, last] = blockRange(game);
  if (phaseNumber < first || phaseNumber > last) {
    throw AppError.badRequest(`Este jogo só tem as fases ${first}–${last}`, 'PHASE_OUT_OF_RANGE', { min: first, max: last });
  }
  const phases = content.getPhases(game.id, languageCode);
  const phase = phases[gamePhaseOf(phaseNumber) - 1];
  const items = build[kind]({ languageCode, phaseNumber, phases, phase });
  return { items, etag: `"${game.id}-${languageCode}-${content.getVersion(game.id, languageCode)}-${phaseNumber}"` };
}

module.exports = { getPhaseItems };
