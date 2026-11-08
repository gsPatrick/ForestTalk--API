// Constantes do ElevenLabs (text-to-speech). Docs: POST /v1/text-to-speech/{voice_id}.
module.exports = {
  BASE_URL: 'https://api.elevenlabs.io/v1',
  TIMEOUT_MS: 15_000,
  OUTPUT_FORMAT: 'mp3_44100_128',
  CONTENT_TYPE: 'audio/mpeg',
};
