const { z } = require('zod');
const { LANGUAGE_CODES } = require('../../config/constants');

const language = z.enum(LANGUAGE_CODES);

const langQuery = z.object({ lang: language });
const idParams = z.object({ id: z.string().regex(/^[a-z0-9_-]{1,64}$/i) });
const completeBody = z.object({
  languageCode: language,
  stars: z.number().int().min(1).max(3),
});

module.exports = { langQuery, idParams, completeBody };
