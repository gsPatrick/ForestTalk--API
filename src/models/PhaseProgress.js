const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'PhaseProgress',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      languageCode: { type: DataTypes.STRING(8), allowNull: false },
      phaseNumber: { type: DataTypes.INTEGER, allowNull: false },
      stars: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'phase_progress' },
  );
