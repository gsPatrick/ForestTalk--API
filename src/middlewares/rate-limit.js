const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const tooMany = { error: { code: 'RATE_LIMITED', message: 'Muitas requisições. Tente de novo em instantes.' } };

/** Limite geral por IP (barato e transversal). Desligado nos testes. */
const globalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany,
  skip: () => env.isTest,
});

/** Limite da voz (custo por chamada): 20 por minuto por aparelho (cai no IP sem token). Desligado nos testes. */
const speechLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany,
  keyGenerator: (req) => req.device?.id ?? req.ip,
  validate: { keyGeneratorIpFallback: false },
  skip: () => env.isTest,
});

module.exports = { globalLimiter, speechLimiter };
