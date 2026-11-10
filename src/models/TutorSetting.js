const { DataTypes } = require('sequelize');

/** Meta diária de estudo com o Professor (minutos), uma por aparelho. */
module.exports = (sequelize) =>
  sequelize.define(
    'TutorSetting',
    {
      deviceId: { type: DataTypes.UUID, primaryKey: true },
      dailyGoalMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    },
    { tableName: 'tutor_settings' },
  );
