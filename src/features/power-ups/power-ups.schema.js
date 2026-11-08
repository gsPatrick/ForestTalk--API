const { z } = require('zod');

const consumeBody = z.object({ type: z.enum(['fifty', 'hint']) });

const qty = z.number().int().min(0).max(100).default(0);
const grantBody = z.object({ fifty: qty, hint: qty });

module.exports = { consumeBody, grantBody };
