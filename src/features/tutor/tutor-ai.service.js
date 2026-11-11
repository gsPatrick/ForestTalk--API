const { chatJson, isEnabled } = require('../../providers/openai/openai.client');
const { turnSchema, buildMessages } = require('./tutor-ai.prompt');
const GREETINGS = require('./tutor-greetings.data');

const FOLLOW_UP = {
  en: 'Can you tell me more?',
  es: '¿Puedes contarme más?',
  fr: "Peux-tu m'en dire plus ?",
  it: 'Puoi dirmi di più?',
  ru: 'Можешь рассказать подробнее?',
};

/** Saudação local (sem chamar o modelo): barata, sempre disponível e só no idioma estudado. */
function greeting(session) {
  const g = GREETINGS[session.languageCode];
  const about = g[session.kind](session.topic);
  return `${g.hi}, ${session.displayName}! ${about} ${g.ask}`;
}

const fallbackTurn = (session) => ({
  reply: `${FOLLOW_UP[session.languageCode]}`,
  correction: '',
  grammarIssues: 0,
  suggestions: 0,
});

const count = (n) => (Number.isInteger(n) && n > 0 ? Math.min(n, 5) : 0);

/** Resposta do tutor em conversa livre/tópico/cenário; qualquer falha da IA cai no fallback simples. */
async function aiTurn(session, history, text) {
  if (!isEnabled()) return fallbackTurn(session);
  try {
    const raw = await chatJson({
      messages: buildMessages(session, history, text),
      jsonSchema: turnSchema,
      maxTokens: 400,
      deviceId: session.deviceId,
    });
    const reply = typeof raw.reply === 'string' ? raw.reply.trim() : '';
    if (!reply) return fallbackTurn(session);
    const correction = typeof raw.correction === 'string' ? raw.correction.trim() : '';
    return { reply, correction, grammarIssues: count(raw.grammarIssues), suggestions: count(raw.suggestions) };
  } catch {
    return fallbackTurn(session);
  }
}

module.exports = { greeting, aiTurn };
