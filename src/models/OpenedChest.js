const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'OpenedChest',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      languageCode: { type: DataTypes.STRING(8), allowNull: false },
      afterPhaseNumber: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'opened_chests' },
  );
