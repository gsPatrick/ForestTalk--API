const scripts = require('./chat-fallback.data');

// Modo de teste (sem chave): respostas roteirizadas, como o mock do app.
const script = (languageCode) => scripts[languageCode] ?? scripts.en;
const turnOf = (languageCode, turn) => {
  const { turns } = script(languageCode);
  return turns[turn % turns.length];
};

const greeting = (languageCode) => script(languageCode).greeting;
const reply = (languageCode, turn) => turnOf(languageCode, turn).ai;
const suggestions = (languageCode, turn) => [turnOf(languageCode, turn).user];

module.exports = { greeting, reply, suggestions };
