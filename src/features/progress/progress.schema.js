const { z } = require('zod');
const { LANGUAGE_CODES, TOTAL_PHASES } = require('../../config/constants');

const code = z.enum(LANGUAGE_CODES);
const phaseNumber = z.coerce.number().int().min(1).max(TOTAL_PHASES);
// Baús existem após as fases 5, 10, 15, ... 120.
const chestAfter = z.coerce
  .number()
  .int()
  .min(1)
  .max(TOTAL_PHASES)
  .refine((n) => n % 5 === 0, 'Não existe baú após essa fase');

const codeParams = z.object({ code });
const phaseParams = z.object({ code, n: phaseNumber });
const chestParams = z.object({ code, after: chestAfter });
// O app decide as moedas (0 em repetição, 10 na 1ª vez) e as envia; o teto só barra valores absurdos.
const coins = z.number().int().min(0).max(1000);
const completeBody = z.object({ stars: z.number().int().min(1).max(3), coinsEarned: coins });
const chestBody = z.object({ coins });

module.exports = { codeParams, phaseParams, chestParams, completeBody, chestBody };
