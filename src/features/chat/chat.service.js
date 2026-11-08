const { aiUnavailable } = require('../../providers/openai/openai.errors');
const { chatJson, isEnabled } = require('../../providers/openai/openai.client');
const { chatLineSchema } = require('./chat-ai-schema');
const { publicCharacters } = require('./chat.constants');
const fallback = require('./chat-fallback.service');
const { buildContext } = require('./chat-context.service');
const { resetConversation, remember, recentHistory } = require('./chat-history.service');
const { startMessages, replyMessages } = require('./chat-prompt.service');
const { consumeMessage, refundMessage } = require('./chat-usage.service');

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

/** Normaliza a resposta da IA para `ChatLine`; transliteração só no russo. */
function toLine(raw, languageCode) {
  const text = str(raw.text);
  if (!text) throw aiUnavailable('empty_text');
  const line = { text, translation: str(raw.translation) };
  if (languageCode === 'ru') line.transliteration = str(raw.transliteration);
  return line;
}

const listCharacters = () => publicCharacters();

const ask = (messages, languageCode, deviceId) =>
  chatJson({ messages, jsonSchema: chatLineSchema(languageCode), deviceId }).then((raw) => toLine(raw, languageCode));

/** Abre a conversa do zero (apaga a anterior desse personagem/idioma) e guarda a saudação. */
async function start(deviceId, characterId, languageCode) {
  let greeting;
  if (isEnabled()) {
    const context = await buildContext(deviceId, languageCode);
    greeting = await ask(startMessages(characterId, languageCode, context), languageCode, deviceId);
  } else {
    greeting = fallback.greeting(languageCode);
  }
  await resetConversation(deviceId, characterId, languageCode, greeting);
  return greeting;
}

const suggestions = (languageCode, turn) => fallback.suggestions(languageCode, turn);

/** Pede a resposta à IA com histórico (memória) e vocabulário do aluno (RAG). */
async function aiReply(deviceId, { characterId, languageCode, text }) {
  const [context, history] = await Promise.all([
    buildContext(deviceId, languageCode, text),
    recentHistory(deviceId, characterId, languageCode),
  ]);
  return ask(replyMessages(characterId, languageCode, text, context, history), languageCode, deviceId);
}

/** Consome a cota do dia e responde; se a IA falhar, a cota volta. A troca fica na memória. */
async function send(deviceId, input) {
  await consumeMessage(deviceId);
  let line;
  try {
    line = isEnabled() ? await aiReply(deviceId, input) : fallback.reply(input.languageCode, input.turn);
  } catch (err) {
    await refundMessage(deviceId);
    throw err;
  }
  await remember(deviceId, input.characterId, input.languageCode, input.text, line);
  return line;
}

module.exports = { listCharacters, start, suggestions, send };
