const crypto = require('node:crypto');
const env = require('../../config/env');
const { DEFAULT_MAX_TOKENS } = require('./openai.config');

/** `safety_identifier`: id estável e anônimo (hash) do aparelho, como a OpenAI recomenda. */
const safetyId = (deviceId) => crypto.createHash('sha256').update(String(deviceId)).digest('hex');

/**
 * Corpo do Chat Completions com Structured Outputs (`json_schema` estrito).
 * `max_tokens` é obsoleto: usa `max_completion_tokens`. Sem `temperature`, que alguns modelos rejeitam.
 */
function buildChatBody({ messages, jsonSchema, maxTokens = DEFAULT_MAX_TOKENS, deviceId }) {
  const body = {
    model: env.OPENAI_MODEL,
    messages,
    max_completion_tokens: maxTokens,
    response_format: { type: 'json_schema', json_schema: { name: jsonSchema.name, strict: true, schema: jsonSchema.schema } },
  };
  if (deviceId) body.safety_identifier = safetyId(deviceId);
  return body;
}

module.exports = { buildChatBody, safetyId };
