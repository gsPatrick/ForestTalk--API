const { z } = require('zod');

const equipBody = z.object({ animalId: z.string().min(1).max(32).nullable() });

const unlockBody = z.object({ animalId: z.string().min(1).max(32) });

module.exports = { equipBody, unlockBody };
