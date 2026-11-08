const { Wallet, PhaseProgress, OpenedChest } = require('../../models');
const { MAX_LIVES } = require('../../config/constants');
const { isPremium } = require('../subscription/premium-status.service');

/** Monta o `UserProgress` (formato do app) de um idioma. */
async function getProgress(deviceId, code, { transaction } = {}) {
  const queries = [
    () => Wallet.findByPk(deviceId, { transaction }),
    () => PhaseProgress.findAll({ where: { deviceId, languageCode: code }, transaction }),
    () => OpenedChest.findAll({ where: { deviceId, languageCode: code }, order: [['afterPhaseNumber', 'ASC']], transaction }),
    () => isPremium(deviceId),
  ];
  // Dentro de uma transação todas as consultas dividem a mesma conexão: precisam ser em sequência
  // (o `pg` avisa que consultas simultâneas na mesma conexão deixarão de funcionar).
  const [wallet, phases, chests, premium] = transaction
    ? await queries.reduce(async (acc, run) => [...(await acc), await run()], Promise.resolve([]))
    : await Promise.all(queries.map((run) => run()));
  return {
    currentLives: MAX_LIVES,
    maxLives: MAX_LIVES,
    coins: wallet?.coins ?? 0,
    isPremium: premium,
    completedPhases: Object.fromEntries(phases.map((p) => [String(p.phaseNumber), p.stars])),
    openedChests: chests.map((c) => c.afterPhaseNumber),
  };
}

module.exports = { getProgress };
