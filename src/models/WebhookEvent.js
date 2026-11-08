const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'WebhookEvent',
    {
      id: { type: DataTypes.STRING(128), primaryKey: true },
      type: { type: DataTypes.STRING(64), allowNull: false },
      payload: { type: DataTypes.JSONB, allowNull: false },
      processedAt: { type: DataTypes.DATE },
    },
    { tableName: 'webhook_events' },
  );
