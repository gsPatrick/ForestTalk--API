const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Subscription',
    {
      deviceId: { type: DataTypes.UUID, primaryKey: true },
      planId: { type: DataTypes.STRING(64) },
      status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'inactive' }, // active | inactive
      source: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'test' }, // test | revenuecat
      expiresAt: { type: DataTypes.DATE },
    },
    { tableName: 'subscriptions' },
  );
