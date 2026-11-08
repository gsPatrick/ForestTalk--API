const { ChatMessage } = require('../../models');
const { HISTORY_TURNS, KEEP_MESSAGES } = require('./chat.constants');

const conversation = (deviceId, characterId, languageCode) => ({ deviceId, characterId, languageCode });

/** Começa do zero: apaga a conversa anterior desse personagem/idioma e guarda a saudação. */
async function resetConversation(deviceId, characterId, languageCode, greeting) {
  const where = conversation(deviceId, characterId, languageCode);
  await ChatMessage.destroy({ where });
  await ChatMessage.create({ ...where, role: 'ai', ...pickLine(greeting) });
}

const pickLine = (line) => ({ text: line.text, translation: line.translation ?? null, transliteration: line.transliteration ?? null });

/** Guarda a fala do aluno e a resposta do personagem; mantém só as últimas `KEEP_MESSAGES`. */
async function remember(deviceId, characterId, languageCode, userText, reply) {
  const where = conversation(deviceId, characterId, languageCode);
  await ChatMessage.bulkCreate([
    { ...where, role: 'user', text: userText },
    { ...where, role: 'ai', ...pickLine(reply) },
  ]);
  const old = await ChatMessage.findAll({ where, order: [['id', 'DESC']], offset: KEEP_MESSAGES, attributes: ['id'] });
  if (old.length) await ChatMessage.destroy({ where: { id: old.map((m) => m.id) } });
}

/** Últimas falas em ordem cronológica, no formato de mensagens da OpenAI. */
async function recentHistory(deviceId, characterId, languageCode) {
  const rows = await ChatMessage.findAll({
    where: conversation(deviceId, characterId, languageCode),
    order: [['id', 'DESC']],
    limit: HISTORY_TURNS * 2,
  });
  return rows.reverse().map((m) =>
    m.role === 'user'
      ? { role: 'user', content: `Learner said: """${m.text}"""` }
      : { role: 'assistant', content: JSON.stringify(pickLine(m)) },
  );
}

module.exports = { resetConversation, remember, recentHistory };
