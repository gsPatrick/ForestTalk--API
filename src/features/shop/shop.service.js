const { sequelize } = require('../../models');
const { spendCoins, addPowerUps } = require('../wallet/wallet-credit.service');
const { getWallet } = require('../wallet/wallet.service');
const { SHOP_ITEMS } = require('./shop.constants');

const listItems = () => SHOP_ITEMS;

/** Gasta as moedas e entrega os power-ups na mesma transação. `result` = PurchaseResult do app. */
async function buy(deviceId, itemId) {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return { result: 'unknownItem', ...(await getWallet(deviceId)) };
  return sequelize.transaction(async (transaction) => {
    const spent = await spendCoins(deviceId, item.price, { transaction });
    if (spent) await addPowerUps(deviceId, { fifty: item.fifty, hint: item.hint }, { transaction });
    return { result: spent ? 'ok' : 'notEnoughCoins', ...(await getWallet(deviceId, { transaction })) };
  });
}

module.exports = { listItems, buy };
