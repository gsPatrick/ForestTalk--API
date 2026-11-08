const { DataTypes } = require('sequelize');

/** Carteira global do jogador: moedas e estoque de power-ups. */
module.exports = (sequelize) =>
  sequelize.define(
    'Wallet',
    {
      deviceId: { type: DataTypes.UUID, primaryKey: true },
      coins: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      fifty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
      hint: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
    },
    { tableName: 'wallets' },
  );
