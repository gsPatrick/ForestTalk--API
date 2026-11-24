// Regras do jogo (espelham GameRules do app Flutter). Mudou lá, mude aqui.
module.exports = {
  MAX_LIVES: 3,
  TOTAL_CHAPTERS: 25,
  PHASES_PER_CHAPTER: 10,
  TOTAL_PHASES: 250,
  SMALL_CHEST_PHASE: 5,
  // Moedas por fase concluída na 1ª vez (era 10; economia mais difícil). O app decide e envia `coinsEarned`.
  PHASE_COIN_REWARD: 4,
  // Custo de reviver com moedas (era 40). O app aplica o valor; documentado aqui para manter a paridade.
  REVIVE_COIN_COST: 60,
  // Moedas dos baús (era 30/80, +40 de bônus da coleção completa; -60%). O app decide e envia em `coins`.
  CHEST_COIN_REWARD: { small: 12, big: 32, collectionBonus: 16 },
  STARTING_COINS: 0,
  STARTING_POWER_UPS: 2,
  PHASES_PER_GAME: 50,
  DEFAULT_LANGUAGE: 'en',
  LANGUAGE_CODES: ['en', 'es', 'fr', 'it', 'ru', 'de', 'th', 'ja', 'zh'],
  // Idiomas cujo texto vem com transliteração latina (romaji, pinyin, RTGS, translit russa).
  TRANSLIT_LANGUAGE_CODES: ['ru', 'th', 'ja', 'zh'],
  DEVICE_PLATFORMS: ['ios', 'android', 'web'],
};
