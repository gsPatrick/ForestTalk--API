const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../models');
const env = require('../../config/env');
const AppError = require('../../utils/app-error');

const today = () => new Date().toISOString().slice(0, 10);
const nextResetAt = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString();
};

/** Consome 1 mensagem do dia (UTC) de forma atômica; sem cota restante: 429 `CHAT_LIMIT_REACHED`. */
async function consumeMessage(deviceId) {
  const rows = await sequelize.query(
    `INSERT INTO chat_usage (device_id, day, messages, created_at, updated_at)
     VALUES (:deviceId, :day, 1, NOW(), NOW())
     ON CONFLICT (device_id, day) DO UPDATE
       SET messages = chat_usage.messages + 1, updated_at = NOW()
       WHERE chat_usage.messages < :limit
     RETURNING messages`,
    { replacements: { deviceId, day: today(), limit: env.CHAT_DAILY_LIMIT }, type: QueryTypes.SELECT },
  );
  if (rows.length === 0) {
    throw new AppError(429, 'CHAT_LIMIT_REACHED', 'Limite diário de mensagens atingido', {
      limit: env.CHAT_DAILY_LIMIT,
      resetAt: nextResetAt(),
    });
  }
}

/** Devolve a mensagem consumida quando a IA falhou (o aluno não perde cota). */
async function refundMessage(deviceId) {
  await sequelize.query(
    'UPDATE chat_usage SET messages = GREATEST(messages - 1, 0) WHERE device_id = :deviceId AND day = :day',
    { replacements: { deviceId, day: today() }, type: QueryTypes.UPDATE },
  );
}

module.exports = { consumeMessage, refundMessage };
