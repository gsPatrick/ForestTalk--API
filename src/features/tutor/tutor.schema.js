const { z } = require('zod');
const { LANGUAGE_CODES } = require('../../config/constants');
const { GOALS, MAX_DURATION_SECONDS } = require('./tutor.constants');

const languageCode = z.enum(LANGUAGE_CODES);
const text = (max) => z.string().trim().min(1).max(max);

const languageQuery = z.object({ languageCode: languageCode.default('en') });
const idParams = z.object({ id: z.uuid() });

const createBody = z
  .object({
    languageCode,
    lessonId: text(64).optional(),
    topic: text(200).optional(),
    scenario: text(200).optional(),
    displayName: text(40),
  })
  .refine((b) => [b.lessonId, b.topic, b.scenario].filter(Boolean).length <= 1, 'Informe só lessonId, topic ou scenario');

const turnBody = z.object({ text: text(1000), source: z.enum(['text', 'voice']).default('text') });
const completeBody = z.object({
  durationSeconds: z.number().int().min(0).max(MAX_DURATION_SECONDS),
  completed: z.boolean(),
});
const settingsBody = z.object({ dailyGoalMinutes: z.number().refine((n) => GOALS.includes(n), `Use ${GOALS.join(', ')}`) });

module.exports = { languageQuery, idParams, createBody, turnBody, completeBody, settingsBody };
