const AppError = require('../../utils/app-error');
const { loadSummaries, loadScenarioContent } = require('../../providers/scenarios/scenarios.provider');

const notFound = () => AppError.notFound('Cenário não encontrado', 'SCENARIO_NOT_FOUND');

const listScenarios = () => loadSummaries();

async function findSummary(id) {
  const summary = (await loadSummaries()).find((s) => s.id === id);
  if (!summary) throw notFound();
  return summary;
}

/** Cenário completo (`SimScenario`): resumo + npcName + turnos no idioma. */
async function getScenario(id, languageCode) {
  const summary = await findSummary(id);
  const raw = await loadScenarioContent(languageCode, id);
  if (!raw) throw notFound();
  const turns = raw.turns.map((t) => ({
    npc: t.npc,
    npcPt: t.npcPt,
    npcTranslit: t.npcTranslit ?? t.translit ?? null,
    options: t.options.map((o) => ({
      text: o.text,
      textPt: o.textPt,
      hint: o.hint ?? null,
      translit: o.translit ?? null,
    })),
  }));
  return { summary, npcName: raw.npcName, turns };
}

module.exports = { listScenarios, findSummary, getScenario };
