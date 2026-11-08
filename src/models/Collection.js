const { DataTypes } = require('sequelize');

/** Animal equipado como mascote (null = leão inicial). As cartas ficam em CollectionCard. */
module.exports = (sequelize) =>
  sequelize.define(
    'Collection',
    {
      deviceId: { type: DataTypes.UUID, primaryKey: true },
      equippedAnimalId: { type: DataTypes.STRING(32) },
    },
    { tableName: 'collections' },
  );
