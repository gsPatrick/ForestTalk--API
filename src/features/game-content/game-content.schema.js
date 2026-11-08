const { z } = require('zod');

// O idioma é checado no service (404 LANGUAGE_NOT_FOUND); a fase fora do bloco vira PHASE_OUT_OF_RANGE.
const phaseParams = z.object({
  code: z.string().min(1).max(8),
  n: z.coerce.number().int().min(1),
});

module.exports = { phaseParams };
