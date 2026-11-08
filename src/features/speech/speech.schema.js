const { z } = require('zod');
const { LANGUAGE_CODES } = require('../../config/constants');
const { CHARACTER_IDS } = require('../../providers/elevenlabs/character-voices');

const speakBody = z.object({
  languageCode: z.enum(LANGUAGE_CODES),
  /** Personagem que fala (escolhe a voz). Sem ele, usa a voz padrão. */
  characterId: z.enum(CHARACTER_IDS).optional(),
  text: z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim())
    .pipe(z.string().min(1).max(300)),
});

module.exports = { speakBody };
