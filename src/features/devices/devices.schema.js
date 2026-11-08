const { z } = require('zod');
const { DEVICE_PLATFORMS } = require('../../config/constants');

const registerBody = z.object({
  platform: z.enum(DEVICE_PLATFORMS),
  appVersion: z.string().max(32).optional(),
  locale: z.string().max(16).optional(),
});

module.exports = { registerBody };
