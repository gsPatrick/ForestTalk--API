const { PhaseProgress, OpenedChest, SimulationCompletion, CollectionCard, Wallet } = require('../../models');
const { isPremium } = require('../subscription/premium-status.service');
const { ANIMALS } = require('../collection/collection.constants');
const { computeStreaks } = require('./profile-streak');
const { phaseStats } = require('./profile-stats.service');
const { wordsOfPhases } = require('./profile-words.service');

/** Perfil do jogador num idioma: estatísticas + palavras aprendidas (fases concluídas). */
async function getProfile(deviceId, code) {
  const [rows, allRows, chests, sims, cards, wallet, premium] = await Promise.all([
    PhaseProgress.findAll({ where: { deviceId, languageCode: code } }),
    PhaseProgress.findAll({ where: { deviceId }, attributes: ['updatedAt'] }),
    OpenedChest.count({ where: { deviceId, languageCode: code } }),
    SimulationCompletion.count({ where: { deviceId, languageCode: code } }),
    CollectionCard.count({ where: { deviceId } }),
    Wallet.findByPk(deviceId),
    isPremium(deviceId),
  ]);
  const words = wordsOfPhases(code, rows.map((r) => r.phaseNumber));
  // Datas UTC distintas de atividade em TODOS os idiomas do aparelho.
  const days = allRows.map((r) => r.updatedAt.toISOString().slice(0, 10));
  const streak = computeStreaks(days, new Date().toISOString().slice(0, 10));
  return {
    stats: {
      ...phaseStats(rows),
      wordsLearned: words.length,
      streakDays: streak.current,
      bestStreakDays: streak.best,
      chestsOpened: chests,
      simulationsDone: sims,
      animalsOwned: cards + 1,
      animalsTotal: ANIMALS.length + 1,
      coins: wallet?.coins ?? 0,
      isPremium: premium,
    },
    words,
  };
}

module.exports = { getProfile };
