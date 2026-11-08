const { Wallet } = require('../../models');
const AppError = require('../../utils/app-error');
const { spendCoins, addCoins } = require('./wallet-credit.service');

/** Foto da carteira: moedas + estoque de power-ups. */
async function getWallet(deviceId, { transaction } = {}) {
  const wallet = await Wallet.findByPk(deviceId, { transaction });
  if (!wallet) throw AppError.notFound('Carteira não encontrada', 'WALLET_NOT_FOUND');
  return { coins: wallet.coins, powerUps: { fifty: wallet.fifty, hint: wallet.hint } };
}

/** Gasta moedas se houver saldo. Sempre devolve o saldo atual. */
async function spend(deviceId, amount) {
  const spent = await spendCoins(deviceId, amount);
  const { coins } = await getWallet(deviceId);
  return { ok: spent, coins };
}

/** Soma moedas ao saldo global (ex.: fim de uma simulação). Devolve o saldo atual. */
async function earn(deviceId, amount) {
  await addCoins(deviceId, amount);
  return getWallet(deviceId);
}

module.exports = { getWallet, spend, earn };
