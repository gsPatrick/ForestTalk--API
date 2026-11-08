const { z } = require('zod');
const { LANGUAGE_CODES } = require('../../config/constants');
const { CHARACTERS, MAX_TEXT } = require('./chat.constants');

const language = z.enum(LANGUAGE_CODES);
const characterId = z.enum(CHARACTERS.map((c) => c.id));

// Remove caracteres de controle e espaços repetidos antes de validar o tamanho.
const cleanText = z
  .string()
  .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim())
  .pipe(z.string().min(1).max(MAX_TEXT));

const startBody = z.object({ characterId, languageCode: language });
const sendBody = z.object({ characterId, languageCode: language, text: cleanText, turn: z.number().int().min(0).max(10_000) });
const suggestionsQuery = z.object({ lang: language, turn: z.coerce.number().int().min(0).max(10_000).default(0) });

module.exports = { startBody, sendBody, suggestionsQuery };
