// Constantes da OpenAI (Chat Completions). Uma responsabilidade: onde e como falar com a API.
module.exports = {
  CHAT_URL: 'https://api.openai.com/v1/chat/completions',
  TIMEOUT_MS: 15_000,
  RETRIES: 1,
  DEFAULT_MAX_TOKENS: 300,
};
