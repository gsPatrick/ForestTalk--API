'use strict';

/** Simulações concluídas, uso diário da conversa com IA e eventos de webhook recebidos. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, STRING, INTEGER, DATE, DATEONLY, JSONB, NOW } = Sequelize;
    const stamps = {
      created_at: { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at: { type: DATE, allowNull: false, defaultValue: NOW },
    };
    const id = { type: INTEGER, primaryKey: true, autoIncrement: true };
    const deviceRef = {
      type: UUID,
      allowNull: false,
      references: { model: 'devices', key: 'id' },
      onDelete: 'CASCADE',
    };

    await queryInterface.createTable('simulation_completions', {
      id,
      device_id: deviceRef,
      language_code: { type: STRING(8), allowNull: false },
      scenario_id: { type: STRING(64), allowNull: false },
      stars: { type: INTEGER, allowNull: false },
      ...stamps,
    });
    await queryInterface.addIndex('simulation_completions', ['device_id', 'language_code', 'scenario_id'], {
      unique: true,
      name: 'simulation_completions_unique',
    });
    await queryInterface.createTable('chat_usage', {
      id,
      device_id: deviceRef,
      day: { type: DATEONLY, allowNull: false },
      messages: { type: INTEGER, allowNull: false, defaultValue: 0 },
      ...stamps,
    });
    await queryInterface.addIndex('chat_usage', ['device_id', 'day'], { unique: true, name: 'chat_usage_unique' });
    await queryInterface.createTable('webhook_events', {
      id: { type: STRING(128), primaryKey: true },
      type: { type: STRING(64), allowNull: false },
      payload: { type: JSONB, allowNull: false },
      processed_at: { type: DATE },
      ...stamps,
    });
  },

  async down(queryInterface) {
    for (const table of ['webhook_events', 'chat_usage', 'simulation_completions']) {
      await queryInterface.dropTable(table);
    }
  },
};
