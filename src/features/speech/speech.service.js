const { synthesize } = require('../../providers/elevenlabs/elevenlabs.client');

/** Áudio MP3 da fala. O idioma vem no texto; `languageCode` só valida que é um idioma suportado. */
const speak = ({ text, characterId }) => synthesize(text, characterId);

module.exports = { speak };
