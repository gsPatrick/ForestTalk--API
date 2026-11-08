const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ChatUsage',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      day: { type: DataTypes.DATEONLY, allowNull: false },
      messages: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'chat_usage' },
  );
