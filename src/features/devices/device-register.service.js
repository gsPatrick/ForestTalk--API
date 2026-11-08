const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { STARTING_COINS, STARTING_POWER_UPS } = require('../../config/constants');
const { sequelize, Device, Wallet, Collection, Subscription } = require('../../models');

/** Cria o aparelho (identidade anônima) com carteira, coleção e assinatura vazias; devolve o token. */
async function registerDevice({ platform, appVersion, locale }) {
  const device = await sequelize.transaction(async (transaction) => {
    const created = await Device.create({ platform, appVersion, locale }, { transaction });
    const deviceId = created.id;
    await Wallet.create(
      { deviceId, coins: STARTING_COINS, fifty: STARTING_POWER_UPS, hint: STARTING_POWER_UPS },
      { transaction },
    );
    await Collection.create({ deviceId }, { transaction });
    await Subscription.create({ deviceId }, { transaction });
    return created;
  });
  const token = jwt.sign({}, env.JWT_SECRET, { subject: device.id, expiresIn: env.JWT_EXPIRES_IN });
  return { deviceId: device.id, token };
}

module.exports = { registerDevice };
