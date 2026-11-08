const { sequelize } = require('../../models');

/** Sonda para orquestração: responde mesmo com o banco fora (`db: "down"`). */
async function checkHealth() {
  let db = 'up';
  try {
    await sequelize.query('SELECT 1');
  } catch {
    db = 'down';
  }
  return { status: db === 'up' ? 'ok' : 'degraded', db, uptime: Math.round(process.uptime()) };
}

module.exports = { checkHealth };
