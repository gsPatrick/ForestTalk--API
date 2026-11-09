const { PhaseProgress } = require('../../models');
const { LANGUAGE_CODES } = require('../../config/constants');
const { phaseStats } = require('./profile-stats.service');
const { wordsOfPhases } = require('./profile-words.service');

/** Resumo de cada idioma do aparelho (uma consulta só, agrupada em memória). */
async function getLanguagesSummary(deviceId) {
  const rows = await PhaseProgress.findAll({ where: { deviceId } });
  return LANGUAGE_CODES.map((code) => {
    const mine = rows.filter((r) => r.languageCode === code);
    const s = phaseStats(mine);
    const last = mine.reduce((max, r) => (max === null || r.updatedAt > max ? r.updatedAt : max), null);
    return {
      code,
      phasesCompleted: s.phasesCompleted,
      totalPhases: s.totalPhases,
      stars: s.stars,
      maxStars: s.maxStars,
      wordsLearned: wordsOfPhases(code, mine.map((r) => r.phaseNumber)).length,
      chaptersCompleted: s.chaptersCompleted,
      lastPlayedAt: last ? last.toISOString() : null,
    };
  });
}

module.exports = { getLanguagesSummary };
