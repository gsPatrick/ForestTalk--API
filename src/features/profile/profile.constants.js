const { PHASES_PER_GAME, PHASES_PER_CHAPTER, TOTAL_PHASES, TOTAL_CHAPTERS } = require('../../config/constants');
const { GAMES, blockRange } = require('../game-content/game-content.constants');

// Chaves de jogo na ordem da trilha, com o intervalo global de fases de cada uma.
const GAME_KEYS = Object.keys(GAMES).map((key) => {
  const [first, last] = blockRange(GAMES[key]);
  return { key, game: GAMES[key], first, last };
});

/** Chave do jogo ('true-false', ...) a que a fase global pertence. */
const gameKeyOf = (phase) => GAME_KEYS.find((g) => phase >= g.first && phase <= g.last).key;

module.exports = { GAME_KEYS, gameKeyOf, PHASES_PER_GAME, PHASES_PER_CHAPTER, TOTAL_PHASES, TOTAL_CHAPTERS };
