const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ChatMessage',
    {
      deviceId: { type: DataTypes.UUID, allowNull: false },
      characterId: { type: DataTypes.STRING(32), allowNull: false },
      languageCode: { type: DataTypes.STRING(8), allowNull: false },
      role: { type: DataTypes.STRING(8), allowNull: false }, // 'user' | 'ai'
      text: { type: DataTypes.TEXT, allowNull: false },
      translation: { type: DataTypes.TEXT },
      transliteration: { type: DataTypes.TEXT },
    },
    { tableName: 'chat_messages' },
  );
