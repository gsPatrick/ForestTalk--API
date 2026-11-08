const { sequelize, CollectionCard } = require('../../models');
const AppError = require('../../utils/app-error');
const { lockWallet } = require('../wallet/wallet-credit.service');
const { ANIMALS } = require('./collection.constants');

/**
 * Desbloqueia uma carta (contrato do app); ignora se já tiver. A ordem de ganho vira a posição.
 * Trava a carteira do aparelho para dois pedidos simultâneos não repetirem a posição.
 */
async function unlock(deviceId, animalId) {
  if (!ANIMALS.some((a) => a.id === animalId)) throw AppError.notFound('Animal desconhecido', 'UNKNOWN_ANIMAL');
  await sequelize.transaction(async (transaction) => {
    await lockWallet(deviceId, { transaction });
    const owned = await CollectionCard.count({ where: { deviceId, animalId }, transaction });
    if (owned) return;
    const position = await CollectionCard.count({ where: { deviceId }, transaction });
    await CollectionCard.create({ deviceId, animalId, position }, { transaction });
  });
}

module.exports = { unlock };
