const { DataTypes } = require('sequelize');

/** Sessão com o Professor de IA. `state` guarda o passo do roteiro (ou o histórico da conversa livre). */
module.exports = (sequelize) =>
  sequelize.define(
    'TutorSession',
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      deviceId: { type: DataTypes.UUID, allowNull: false },
      languageCode: { type: DataTypes.STRING(8), allowNull: false },
      kind: { type: DataTypes.STRING(16), allowNull: false }, // lesson | topic | scenario | free
      lessonId: { type: DataTypes.STRING(64) },
      topic: { type: DataTypes.STRING(200) },
      title: { type: DataTypes.STRING(200), allowNull: false },
      displayName: { type: DataTypes.STRING(40), allowNull: false },
      state: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      grammar: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      suggestions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      pronunciation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      done: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      durationSeconds: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      startedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      endedAt: { type: DataTypes.DATE },
    },
    { tableName: 'tutor_sessions' },
  );
