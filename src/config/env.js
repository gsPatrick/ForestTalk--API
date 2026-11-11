const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Em teste, `.env.test` vem primeiro (dotenv não sobrescreve o que já foi carregado).
const root = path.resolve(__dirname, '..', '..');
if (process.env.NODE_ENV === 'test') dotenv.config({ path: path.join(root, '.env.test'), quiet: true });
dotenv.config({ path: path.join(root, '.env'), quiet: true });

const bool = z.enum(['true', 'false']).transform((v) => v === 'true');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(3333),
  API_PREFIX: z.string().default('/api'),
  LOG_LEVEL: z.enum(['silent', 'error', 'info', 'debug']).default('info'),
  CORS_ORIGINS: z.string().default('*'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  // Produção usa SSL no banco por padrão; use `false` para bancos sem SSL (ex.: sslmode=disable).
  DATABASE_SSL: bool.default(true),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET precisa de ao menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('365d'),
  CONTENT_DIR: z.string().default('../ForestTalk--FRONT/assets/content'),
  SUBSCRIPTION_TEST_MODE: bool.default(true),
  REVENUECAT_API_KEY: z.string().default(''),
  REVENUECAT_WEBHOOK_AUTH: z.string().default(''),
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  ELEVENLABS_API_KEY: z.string().default(''),
  ELEVENLABS_VOICE_ID: z.string().default(''),
  ELEVENLABS_MODEL: z.string().default('eleven_v4'),
  CHAT_DAILY_LIMIT: z.coerce.number().int().positive().default(60),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
}

const env = parsed.data;

module.exports = {
  ...env,
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  contentDir: path.resolve(__dirname, '..', '..', env.CONTENT_DIR),
};
