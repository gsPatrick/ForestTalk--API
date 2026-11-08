const { z } = require('zod');

const buyParams = z.object({ id: z.string().min(1).max(32) });

module.exports = { buyParams };
