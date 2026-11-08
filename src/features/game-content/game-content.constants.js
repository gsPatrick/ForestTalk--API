const { PHASES_PER_GAME } = require('../../config/constants');

// Cada jogo ocupa um bloco seguido da trilha (espelha GameType/GameRules do app).
const GAMES = {
  'true-false': { id: 'true_false', block: 0, items: 10 },
  pairs: { id: 'pairs', block: 1, items: 8 },
  translation: { id: 'translation', block: 2, items: 10 },
  pronunciation: { id: 'pronunciation', block: 3, items: 8 },
};

const PHASES_PER_CHAPTER = 10;

/** Fase (1..30) dentro do jogo a partir da fase global. */
const gamePhaseOf = (phaseNumber) => ((phaseNumber - 1) % PHASES_PER_GAME) + 1;

/** A partir da fase 11 do jogo, 1 em cada 3 fases de Tradução é invertida (PT → idioma): 12, 15, ... 30. */
function isInvertedTranslation(phaseNumber) {
  const k = gamePhaseOf(phaseNumber);
  return k > PHASES_PER_CHAPTER && k % 3 === 0;
}

/** Intervalo global [first, last] de fases do jogo. */
const blockRange = (game) => [game.block * PHASES_PER_GAME + 1, (game.block + 1) * PHASES_PER_GAME];

module.exports = { GAMES, gamePhaseOf, isInvertedTranslation, blockRange };
