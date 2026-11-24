'use strict';

/**
 * Cada jogo passou de 30 para 50 fases: a numeração global dos jogos 2–4 andou (31→51, 61→101, 91→151).
 * Remapeia o progresso já salvo (fase concluída e baú aberto) para continuar apontando para a mesma fase do mesmo jogo.
 * Linha a linha, da maior para a menor, para nunca bater no índice único no meio do caminho.
 */
const TABLES = [
  { table: 'phase_progress', column: 'phase_number' },
  { table: 'opened_chests', column: 'after_phase_number' },
];

async function remap(queryInterface, transaction, toNew) {
  for (const { table, column } of TABLES) {
    const [rows] = await queryInterface.sequelize.query(`SELECT id, ${column} AS n FROM ${table} ORDER BY ${column} DESC`, { transaction });
    const ordered = toNew ? rows : [...rows].reverse();
    for (const { id, n } of ordered) {
      const next = toNew ? n + 20 * Math.floor((n - 1) / 30) : n - 20 * Math.floor((n - 1) / 50);
      if (next !== n) {
        await queryInterface.sequelize.query(`UPDATE ${table} SET ${column} = :next WHERE id = :id`, { replacements: { next, id }, transaction });
      }
    }
  }
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) => remap(queryInterface, transaction, true));
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) => remap(queryInterface, transaction, false));
  },
};
