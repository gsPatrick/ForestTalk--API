'use strict';

/** Progresso por idioma (fases e baús) e Coleção de animais. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, STRING, INTEGER, DATE, NOW } = Sequelize;
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

    await queryInterface.createTable('phase_progress', {
      id,
      device_id: deviceRef,
      language_code: { type: STRING(8), allowNull: false },
      phase_number: { type: INTEGER, allowNull: false },
      stars: { type: INTEGER, allowNull: false },
      ...stamps,
    });
    await queryInterface.addIndex('phase_progress', ['device_id', 'language_code', 'phase_number'], {
      unique: true,
      name: 'phase_progress_unique',
    });
    await queryInterface.createTable('opened_chests', {
      id,
      device_id: deviceRef,
      language_code: { type: STRING(8), allowNull: false },
      after_phase_number: { type: INTEGER, allowNull: false },
      ...stamps,
    });
    await queryInterface.addIndex('opened_chests', ['device_id', 'language_code', 'after_phase_number'], {
      unique: true,
      name: 'opened_chests_unique',
    });
    await queryInterface.createTable('collections', {
      device_id: { ...deviceRef, primaryKey: true },
      equipped_animal_id: { type: STRING(32) },
      ...stamps,
    });
    await queryInterface.createTable('collection_cards', {
      id,
      device_id: deviceRef,
      animal_id: { type: STRING(32), allowNull: false },
      position: { type: INTEGER, allowNull: false },
      ...stamps,
    });
    await queryInterface.addIndex('collection_cards', ['device_id', 'animal_id'], {
      unique: true,
      name: 'collection_cards_unique',
    });
  },

  async down(queryInterface) {
    for (const table of ['collection_cards', 'collections', 'opened_chests', 'phase_progress']) {
      await queryInterface.dropTable(table);
    }
  },
};
