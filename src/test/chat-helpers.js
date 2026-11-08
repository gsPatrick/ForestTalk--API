// Apoio aos testes da conversa: cliente Premium e simulação da OpenAI (só ela é interceptada).
const { Subscription } = require('../models');
const { newClient } = require('./helpers');

const realFetch = global.fetch;

async function premiumClient() {
  const c = await newClient();
  await Subscription.upsert({ deviceId: c.deviceId, status: 'active', source: 'test' });
  return c;
}

/** Intercepta só a OpenAI; devolve a lista de corpos enviados. O resto segue para o fetch real. */
function mockOpenAi(handler) {
  const calls = [];
  global.fetch = async (url, init) => {
    if (!String(url).startsWith('https://api.openai.com')) return realFetch(url, init);
    calls.push(JSON.parse(init.body));
    return handler(calls.length);
  };
  return calls;
}

const aiReply = (content) =>
  new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(content) }, finish_reason: 'stop' }] }), { status: 200 });

const sendChat = (c, extra = {}) =>
  c.post('/v1/chat', { characterId: 'fox', languageCode: 'en', text: 'Hello', turn: 0, ...extra });

const restoreFetch = () => {
  global.fetch = realFetch;
};

module.exports = { premiumClient, mockOpenAi, aiReply, sendChat, restoreFetch };
