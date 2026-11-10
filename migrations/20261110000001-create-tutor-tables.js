'use strict';

/** Professor de IA: sessões (estado para continuar, métricas, duração) e meta diária por aparelho. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, STRING, INTEGER, BOOLEAN, JSONB, DATE, NOW } = Sequelize;
    const stamps = {
      created_at: { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at: { type: DATE, allowNull: false, defaultValue: NOW },
    };
    const deviceFk = { type: UUID, allowNull: false, references: { model: 'devices', key: 'id' }, onDelete: 'CASCADE' };
    const count = { type: INTEGER, allowNull: false, defaultValue: 0 };

    await queryInterface.createTable('tutor_sessions', {
      id: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      device_id: deviceFk,
      language_code: { type: STRING(8), allowNull: false },
      kind: { type: STRING(16), allowNull: false },
      lesson_id: { type: STRING(64) },
      topic: { type: STRING(200) },
      title: { type: STRING(200), allowNull: false },
      display_name: { type: STRING(40), allowNull: false },
      state: { type: JSONB, allowNull: false, defaultValue: {} },
      grammar: count,
      suggestions: count,
      pronunciation: count,
      done: { type: BOOLEAN, allowNull: false, defaultValue: false },
      duration_seconds: count,
      completed: { type: BOOLEAN, allowNull: false, defaultValue: false },
      started_at: { type: DATE, allowNull: false, defaultValue: NOW },
      ended_at: { type: DATE },
      ...stamps,
    });
    await queryInterface.addIndex('tutor_sessions', ['device_id', 'language_code', 'started_at'], {
      name: 'tutor_sessions_device_language',
    });
    await queryInterface.createTable('tutor_settings', {
      device_id: { ...deviceFk, primaryKey: true },
      daily_goal_minutes: { type: INTEGER, allowNull: false, defaultValue: 10 },
      ...stamps,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tutor_settings');
    await queryInterface.dropTable('tutor_sessions');
  },
};
