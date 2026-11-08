const { QueryTypes } = require('sequelize');
const { sequelize, Wallet } = require('../../models');

/**
 * Operações atômicas na carteira, para outras features reutilizarem (baús, simulações, loja).
 * Passe `{ transaction }` para participar da transação de quem chama.
 */

async function addCoins(deviceId, amount, { transaction } = {}) {
  if (amount <= 0) return;
  await Wallet.increment({ coins: amount }, { where: { deviceId }, transaction });
}

/** Gasta [amount] moedas só se houver saldo (sem corrida). Devolve `true` se gastou. */
async function spendCoins(deviceId, amount, { transaction } = {}) {
  const rows = await sequelize.query(
    'UPDATE wallets SET coins = coins - :amount, updated_at = NOW() WHERE device_id = :deviceId AND coins >= :amount RETURNING coins',
    { replacements: { amount, deviceId }, type: QueryTypes.SELECT, transaction },
  );
  return rows.length > 0;
}

async function addPowerUps(deviceId, { fifty = 0, hint = 0 }, { transaction } = {}) {
  if (fifty <= 0 && hint <= 0) return;
  await Wallet.increment({ fifty, hint }, { where: { deviceId }, transaction });
}

/** Trava a linha da carteira até o fim da transação: serializa operações do mesmo aparelho. */
async function lockWallet(deviceId, { transaction }) {
  await Wallet.findByPk(deviceId, { transaction, lock: transaction.LOCK.UPDATE });
}

module.exports = { addCoins, spendCoins, addPowerUps, lockWallet };
