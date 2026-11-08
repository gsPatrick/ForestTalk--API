const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../models');
const AppError = require('../../utils/app-error');
const { addPowerUps } = require('../wallet/wallet-credit.service');
const { getWallet } = require('../wallet/wallet.service');

// Colunas permitidas (nunca interpolar entrada do usuário no SQL).
const COLUMNS = { fifty: 'fifty', hint: 'hint' };

async function getPowerUps(deviceId) {
  return (await getWallet(deviceId)).powerUps;
}

/** Decrementa 1 do estoque só se houver (atômico, sem corrida). */
async function consume(deviceId, type) {
  const column = COLUMNS[type];
  const rows = await sequelize.query(
    `UPDATE wallets SET ${column} = ${column} - 1, updated_at = NOW() WHERE device_id = :deviceId AND ${column} > 0 RETURNING ${column}`,
    { replacements: { deviceId }, type: QueryTypes.SELECT },
  );
  if (!rows.length) throw AppError.conflict('Sem power-up disponível', 'NO_POWER_UP');
  return getPowerUps(deviceId);
}

/** Recompensa de baú: soma power-ups ao estoque. */
async function grant(deviceId, { fifty, hint }) {
  await addPowerUps(deviceId, { fifty, hint });
  return getPowerUps(deviceId);
}

module.exports = { getPowerUps, consume, grant };
