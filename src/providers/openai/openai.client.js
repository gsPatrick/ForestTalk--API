const env = require('../../config/env');
const AppError = require('../../utils/app-error');
const { CHAT_URL, TIMEOUT_MS, RETRIES } = require('./openai.config');
const { aiUnavailable } = require('./openai.errors');
const { buildChatBody } = require('./openai.request');
const { parseChatResponse } = require('./openai.response');

// Cliente mínimo (fetch nativo). Nunca registra a chave nem o conteúdo das mensagens.
const isEnabled = () => Boolean(env.OPENAI_API_KEY);

async function callOnce(body) {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.ok) return { json: await res.json() };
  return { retryable: res.status === 429 || res.status >= 500, error: aiUnavailable(`http_${res.status}`) };
}

/** Pede uma resposta JSON (seguindo `jsonSchema`) ao modelo. Erros viram 502 `AI_UNAVAILABLE`. */
async function chatJson(options) {
  if (!isEnabled()) throw aiUnavailable('not_configured');
  const body = buildChatBody(options);
  let last = aiUnavailable();
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    try {
      const result = await callOnce(body);
      if (result.json) return parseChatResponse(result.json);
      last = result.error;
      if (!result.retryable) break;
    } catch (err) {
      last = err instanceof AppError ? err : aiUnavailable(err.name === 'TimeoutError' ? 'timeout' : 'network');
    }
  }
  throw last;
}

module.exports = { chatJson, isEnabled };
