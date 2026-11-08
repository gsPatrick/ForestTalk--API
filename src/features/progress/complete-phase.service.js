const { sequelize, PhaseProgress } = require('../../models');
const { addCoins, lockWallet } = require('../wallet/wallet-credit.service');
const { getProgress } = require('./progress-state.service');

/**
 * Conclui uma fase (contrato do app): guarda a melhor nota em estrelas (nunca diminui) e soma
 * `coinsEarned` ao saldo global. O app decide as moedas (10 na 1ª vez, 0 ao refazer).
 */
async function completePhase(deviceId, code, phaseNumber, { stars, coinsEarned }) {
  return sequelize.transaction(async (transaction) => {
    await lockWallet(deviceId, { transaction });
    const where = { deviceId, languageCode: code };
    const existing = await PhaseProgress.findOne({ where: { ...where, phaseNumber }, transaction });
    if (!existing) await PhaseProgress.create({ ...where, phaseNumber, stars }, { transaction });
    else if (stars > existing.stars) await existing.update({ stars }, { transaction });
    await addCoins(deviceId, coinsEarned, { transaction });
    return getProgress(deviceId, code, { transaction });
  });
}

module.exports = { completePhase };
