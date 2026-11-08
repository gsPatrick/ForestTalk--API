const { aiUnavailable } = require('./openai.errors');

/**
 * Extrai o objeto JSON da resposta. Recusa do modelo (`refusal`), corte por tamanho
 * (`finish_reason: length`) ou JSON inválido viram 502 `AI_UNAVAILABLE`.
 */
function parseChatResponse(json) {
  const choice = json?.choices?.[0];
  if (!choice || choice.message?.refusal) throw aiUnavailable('refusal');
  if (choice.finish_reason === 'length') throw aiUnavailable('truncated');
  try {
    const parsed = JSON.parse(choice.message.content);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // cai no erro abaixo
  }
  throw aiUnavailable('bad_response');
}

module.exports = { parseChatResponse };
