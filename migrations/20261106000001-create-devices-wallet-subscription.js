'use strict';

/** Identidade anônima do aparelho, carteira (moedas + power-ups) e assinatura. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, STRING, INTEGER, DATE, NOW } = Sequelize;
    const stamps = {
      created_at: { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at: { type: DATE, allowNull: false, defaultValue: NOW },
    };
    const deviceFk = {
      type: UUID,
      primaryKey: true,
      allowNull: false,
      references: { model: 'devices', key: 'id' },
      onDelete: 'CASCADE',
    };

    await queryInterface.createTable('devices', {
      id: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      platform: { type: STRING(16), allowNull: false },
      app_version: { type: STRING(32) },
      locale: { type: STRING(16) },
      ...stamps,
    });
    await queryInterface.createTable('wallets', {
      device_id: deviceFk,
      coins: { type: INTEGER, allowNull: false, defaultValue: 0 },
      fifty: { type: INTEGER, allowNull: false, defaultValue: 2 },
      hint: { type: INTEGER, allowNull: false, defaultValue: 2 },
      ...stamps,
    });
    await queryInterface.addConstraint('wallets', {
      fields: ['coins'],
      type: 'check',
      where: { coins: { [Sequelize.Op.gte]: 0 } },
      name: 'wallets_coins_non_negative',
    });
    await queryInterface.createTable('subscriptions', {
      device_id: deviceFk,
      plan_id: { type: STRING(64) },
      status: { type: STRING(16), allowNull: false, defaultValue: 'inactive' },
      source: { type: STRING(16), allowNull: false, defaultValue: 'test' },
      expires_at: { type: DATE },
      ...stamps,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');
    await queryInterface.dropTable('wallets');
    await queryInterface.dropTable('devices');
  },
};
