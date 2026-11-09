const { GAME_KEYS, PHASES_PER_CHAPTER, TOTAL_PHASES, TOTAL_CHAPTERS, PHASES_PER_GAME } = require('./profile.constants');

/** Contagens de fases/estrelas/capítulos/por jogo a partir das linhas de PhaseProgress do idioma. */
function phaseStats(rows) {
  const done = new Set(rows.map((r) => r.phaseNumber));
  let chaptersCompleted = 0;
  for (let ch = 0; ch < TOTAL_CHAPTERS; ch++) {
    const first = ch * PHASES_PER_CHAPTER + 1;
    let all = true;
    for (let n = first; n < first + PHASES_PER_CHAPTER; n++) all = all && done.has(n);
    if (all) chaptersCompleted += 1;
  }
  const perGame = {};
  for (const { key, first, last } of GAME_KEYS) {
    const inGame = rows.filter((r) => r.phaseNumber >= first && r.phaseNumber <= last);
    perGame[key] = { done: inGame.length, total: PHASES_PER_GAME, stars: inGame.reduce((s, r) => s + r.stars, 0) };
  }
  return {
    phasesCompleted: rows.length,
    totalPhases: TOTAL_PHASES,
    stars: rows.reduce((s, r) => s + r.stars, 0),
    maxStars: TOTAL_PHASES * 3,
    chaptersCompleted,
    totalChapters: TOTAL_CHAPTERS,
    perGame,
  };
}

module.exports = { phaseStats };
