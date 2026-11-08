const { QueryTypes } = require('sequelize');
const { sequelize, SimulationCompletion } = require('../../models');
const { findSummary } = require('./scenarios.service');

/**
 * Registra a conclusão (contrato do app): guarda a melhor nota (nunca diminui) e diz se foi a
 * primeira vez do cenário naquele idioma. As moedas o app soma depois em `POST /wallet/earn`.
 */
async function completeScenario(deviceId, scenarioId, { languageCode, stars }) {
  await findSummary(scenarioId);
  return sequelize.transaction(async (transaction) => {
    const [row, firstTime] = await SimulationCompletion.findOrCreate({
      where: { deviceId, languageCode, scenarioId },
      defaults: { stars },
      transaction,
    });
    if (!firstTime) {
      await sequelize.query('UPDATE simulation_completions SET stars = GREATEST(stars, :stars), updated_at = NOW() WHERE id = :id', {
        replacements: { stars, id: row.id },
        type: QueryTypes.UPDATE,
        transaction,
      });
    }
    return { firstTime };
  });
}

/** Mapa id do cenário -> melhor nota, no idioma. */
async function completionsMap(deviceId, languageCode) {
  const rows = await SimulationCompletion.findAll({ where: { deviceId, languageCode } });
  return Object.fromEntries(rows.map((r) => [r.scenarioId, r.stars]));
}

module.exports = { completeScenario, completionsMap };
