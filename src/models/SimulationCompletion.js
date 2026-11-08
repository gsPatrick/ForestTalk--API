const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'SimulationCompletion',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      languageCode: { type: DataTypes.STRING(8), allowNull: false },
      scenarioId: { type: DataTypes.STRING(64), allowNull: false },
      stars: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'simulation_completions' },
  );
