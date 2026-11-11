const env = require('../../config/env');
const AppError = require('../../utils/app-error');
const { voiceFor, SPEECH_SETTINGS } = require('./character-voices');
const { BASE_URL, TIMEOUT_MS, OUTPUT_FORMAT } = require('./elevenlabs.config');

const isEnabled = () => Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID);
const unavailable = (reason) => new AppError(502, 'SPEECH_UNAVAILABLE', 'Serviço de voz indisponível no momento', { reason });

/**
 * Converte texto em áudio MP3. O modelo multilíngue detecta o idioma pelo texto
 * (o modelo detecta o idioma pelo texto; `language_code` não é enviado). Nunca registra chave nem texto.
 */
async function synthesize(text, characterId) {
  if (!isEnabled()) throw new AppError(503, 'SPEECH_NOT_CONFIGURED', 'Voz do servidor não configurada');
  const custom = voiceFor(characterId);
  const voiceId = custom?.voice ?? env.ELEVENLABS_VOICE_ID;
  const url = `${BASE_URL}/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${OUTPUT_FORMAT}`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'xi-api-key': env.ELEVENLABS_API_KEY },
      body: JSON.stringify({
        text,
        model_id: env.ELEVENLABS_MODEL,
        ...(custom && { voice_settings: SPEECH_SETTINGS }),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw unavailable(err.name === 'TimeoutError' ? 'timeout' : 'network');
  }
  if (!res.ok) throw unavailable(`http_${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

module.exports = { synthesize, isEnabled };
