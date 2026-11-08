const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Device',
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      platform: { type: DataTypes.STRING(16), allowNull: false },
      appVersion: { type: DataTypes.STRING(32) },
      locale: { type: DataTypes.STRING(16) },
    },
    { tableName: 'devices' },
  );
