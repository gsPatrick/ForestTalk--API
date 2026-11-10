const { Sequelize } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.NODE_ENV];

const { url, ...options } = dbConfig;
const sequelize = new Sequelize(url, options);

const models = {
  Device: require('./Device')(sequelize),
  Wallet: require('./Wallet')(sequelize),
  Subscription: require('./Subscription')(sequelize),
  PhaseProgress: require('./PhaseProgress')(sequelize),
  OpenedChest: require('./OpenedChest')(sequelize),
  Collection: require('./Collection')(sequelize),
  CollectionCard: require('./CollectionCard')(sequelize),
  SimulationCompletion: require('./SimulationCompletion')(sequelize),
  ChatUsage: require('./ChatUsage')(sequelize),
  ChatMessage: require('./ChatMessage')(sequelize),
  TutorSession: require('./TutorSession')(sequelize),
  TutorSetting: require('./TutorSetting')(sequelize),
  WebhookEvent: require('./WebhookEvent')(sequelize),
};

// Tudo pertence a um aparelho (device); apagar o aparelho apaga seus dados.
const owned = ['Wallet', 'Subscription', 'PhaseProgress', 'OpenedChest', 'Collection', 'CollectionCard', 'SimulationCompletion', 'ChatUsage', 'ChatMessage', 'TutorSession', 'TutorSetting'];
for (const name of owned) {
  models.Device.hasMany(models[name], { foreignKey: 'deviceId', onDelete: 'CASCADE' });
  models[name].belongsTo(models.Device, { foreignKey: 'deviceId' });
}

module.exports = { sequelize, ...models };
