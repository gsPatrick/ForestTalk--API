const env = require('../../config/env');
const AppError = require('../../utils/app-error');
const { sequelize } = require('../../models');
const { addCoins, addPowerUps } = require('../wallet/wallet-credit.service');
const { getWallet } = require('../wallet/wallet.service');
const { COIN_PACKS } = require('./coin-packs.constants');

const listCoinPacks = () => COIN_PACKS;

const findByStoreProduct = (productId) => COIN_PACKS.find((p) => p.storeProductId === productId) ?? null;

/** Credita moedas e power-ups do pacote na transação de quem chama (modo de teste e webhook). */
async function creditPack(deviceId, pack, { transaction }) {
  await addCoins(deviceId, pack.coins, { transaction });
  await addPowerUps(deviceId, { fifty: pack.fifty, hint: pack.hint }, { transaction });
}

/** `POST /shop/coin-packs/:id/buy`: só em modo de teste. Em produção a compra vem da loja → webhook. */
async function buyCoinPack(deviceId, packId) {
  if (!env.SUBSCRIPTION_TEST_MODE) {
    throw AppError.conflict('A compra deve ser feita pela loja de aplicativos', 'USE_STORE_PURCHASE');
  }
  const pack = COIN_PACKS.find((p) => p.id === packId);
  if (!pack) return { result: 'unknownItem', ...(await getWallet(deviceId)) };
  return sequelize.transaction(async (transaction) => {
    await creditPack(deviceId, pack, { transaction });
    return { result: 'ok', ...(await getWallet(deviceId, { transaction })) };
  });
}

module.exports = { listCoinPacks, buyCoinPack, creditPack, findByStoreProduct };
