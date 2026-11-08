const { sequelize, OpenedChest } = require('../../models');
const AppError = require('../../utils/app-error');
const { addCoins, lockWallet } = require('../wallet/wallet-credit.service');
const { getProgress } = require('./progress-state.service');

/**
 * Marca o baú como aberto e soma as moedas da recompensa (contrato do app). A carta e os
 * power-ups do baú chegam em `POST /collection/unlock` e `POST /power-ups/grant`.
 */
async function openChest(deviceId, code, after, coins) {
  return sequelize.transaction(async (transaction) => {
    await lockWallet(deviceId, { transaction });
    const where = { deviceId, languageCode: code, afterPhaseNumber: after };
    if (await OpenedChest.findOne({ where, transaction })) {
      throw AppError.conflict('Baú já aberto', 'CHEST_ALREADY_OPENED');
    }
    await OpenedChest.create(where, { transaction });
    await addCoins(deviceId, coins, { transaction });
    return getProgress(deviceId, code, { transaction });
  });
}

module.exports = { openChest };
