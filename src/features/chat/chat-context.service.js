const { PhaseProgress } = require('../../models');
const content = require('../../providers/content/content.provider');
const { PHASES_PER_GAME } = require('../../config/constants');
const { pickVocabulary } = require('./chat-vocabulary');

const GAME_BY_BLOCK = ['true_false', 'pairs', 'translation', 'pronunciation'];
const STARTER_PHASE = 1;
const MAX_PHASES = 12; // só as fases concluídas mais recentes alimentam o pool

/** Fase de conteúdo (tema + conceitos no idioma) de uma fase global da trilha (1..120). */
function phaseContent(languageCode, phaseNumber) {
  const game = GAME_BY_BLOCK[Math.floor((phaseNumber - 1) / PHASES_PER_GAME)];
  return content.getPhases(game, languageCode)[(phaseNumber - 1) % PHASES_PER_GAME];
}

/**
 * Contexto de RAG da conversa: nível CEFR do aluno (da fase mais alta concluída) e o vocabulário
 * que ele já estudou, priorizando o que citou. Vem do currículo do próprio app, sem busca externa.
 */
async function buildContext(deviceId, languageCode, userText = '') {
  const rows = await PhaseProgress.findAll({
    where: { deviceId, languageCode },
    attributes: ['phaseNumber'],
    order: [['phaseNumber', 'DESC']],
    limit: MAX_PHASES,
  });
  const phaseNumbers = rows.length ? rows.map((r) => r.phaseNumber) : [STARTER_PHASE];
  const phases = phaseNumbers.map((n) => phaseContent(languageCode, n));
  const pool = phases.flatMap((p) => p.concepts);
  return { level: phases[0].level, vocabulary: pickVocabulary(pool, userText) };
}

module.exports = { buildContext };
