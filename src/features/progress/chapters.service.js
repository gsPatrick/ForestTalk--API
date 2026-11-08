const { TOTAL_CHAPTERS, PHASES_PER_CHAPTER, PHASES_PER_GAME, SMALL_CHEST_PHASE } = require('../../config/constants');
const { CHAPTER_SEEDS, GAME_TYPES } = require('./progress.constants');
const { getProgress } = require('./progress-state.service');

const gameTypeOf = (n) => GAME_TYPES[Math.min(Math.floor((n - 1) / PHASES_PER_GAME), GAME_TYPES.length - 1)];

const gameIndexOf = (n) => Math.floor((n - 1) / PHASES_PER_GAME);

/** Cada jogo tem a sua trilha (fases 1–30): a próxima fase de um jogo é a seguinte à maior concluída nele. */
function highestDoneByGame(completed) {
  const highest = {};
  for (const key of Object.keys(completed)) {
    const n = Number(key);
    const g = gameIndexOf(n);
    highest[g] = Math.max(highest[g] ?? gameIndexOf(n) * PHASES_PER_GAME, n);
  }
  return highest;
}

function buildPhase(number, chapter, completed, highest) {
  const stars = completed[String(number)];
  let status = 'locked';
  if (stars !== undefined) status = 'completed';
  else if (number === (highest[gameIndexOf(number)] ?? gameIndexOf(number) * PHASES_PER_GAME) + 1) status = 'available';
  return {
    id: `p${String(number).padStart(3, '0')}`,
    number,
    chapterNumber: chapter,
    gameType: gameTypeOf(number),
    status,
    stars: stars ?? 0,
  };
}

/** Os 12 capítulos × 10 fases, com status derivado do progresso (igual ao MockChapterFactory); cada jogo começa liberado. */
async function getChapters(deviceId, code) {
  const progress = await getProgress(deviceId, code);
  const opened = new Set(progress.openedChests);
  const highest = highestDoneByGame(progress.completedPhases);
  const chest = (afterPhaseNumber, tier) => ({ afterPhaseNumber, tier, opened: opened.has(afterPhaseNumber) });

  return Array.from({ length: TOTAL_CHAPTERS }, (_, i) => {
    const number = i + 1;
    const first = i * PHASES_PER_CHAPTER + 1;
    const last = number * PHASES_PER_CHAPTER;
    const phases = [];
    for (let n = first; n <= last; n++) phases.push(buildPhase(n, number, progress.completedPhases, highest));
    return {
      number,
      title: CHAPTER_SEEDS[i].title,
      theme: CHAPTER_SEEDS[i].theme,
      phases,
      chests: [chest(first + SMALL_CHEST_PHASE - 1, 'small'), chest(last, 'big')],
    };
  });
}

module.exports = { getChapters };
