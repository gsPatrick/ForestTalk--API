'use strict';

/** Memória da conversa com IA: uma conversa por aparelho + personagem + idioma. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, STRING, INTEGER, TEXT, DATE, NOW } = Sequelize;
    await queryInterface.createTable('chat_messages', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      device_id: { type: UUID, allowNull: false, references: { model: 'devices', key: 'id' }, onDelete: 'CASCADE' },
      character_id: { type: STRING(32), allowNull: false },
      language_code: { type: STRING(8), allowNull: false },
      role: { type: STRING(8), allowNull: false },
      text: { type: TEXT, allowNull: false },
      translation: { type: TEXT },
      transliteration: { type: TEXT },
      created_at: { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at: { type: DATE, allowNull: false, defaultValue: NOW },
    });
    await queryInterface.addIndex('chat_messages', ['device_id', 'character_id', 'language_code', 'id'], {
      name: 'chat_messages_conversation',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('chat_messages');
  },
};
