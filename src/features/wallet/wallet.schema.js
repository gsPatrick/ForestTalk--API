const { z } = require('zod');

const spendBody = z.object({ amount: z.number().int().positive().max(1_000_000) });

const earnBody = z.object({ amount: z.number().int().positive().max(1_000_000) });

module.exports = { spendBody, earnBody };
