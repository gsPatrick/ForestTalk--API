// Regras do jogo (espelham GameRules do app Flutter). Mudou lá, mude aqui.
module.exports = {
  MAX_LIVES: 3,
  TOTAL_CHAPTERS: 25,
  PHASES_PER_CHAPTER: 10,
  TOTAL_PHASES: 250,
  SMALL_CHEST_PHASE: 5,
  PHASE_COIN_REWARD: 10,
  STARTING_COINS: 0,
  STARTING_POWER_UPS: 2,
  PHASES_PER_GAME: 50,
  DEFAULT_LANGUAGE: 'en',
  LANGUAGE_CODES: ['en', 'es', 'fr', 'it', 'ru', 'de', 'th', 'ja', 'zh'],
  // Idiomas cujo texto vem com transliteração latina (romaji, pinyin, RTGS, translit russa).
  TRANSLIT_LANGUAGE_CODES: ['ru', 'th', 'ja', 'zh'],
  DEVICE_PLATFORMS: ['ios', 'android', 'web'],
};
