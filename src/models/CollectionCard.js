const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'CollectionCard',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      animalId: { type: DataTypes.STRING(32), allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'collection_cards' },
  );
