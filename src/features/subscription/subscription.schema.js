const { z } = require('zod');
const { PLANS } = require('./subscription.constants');

const subscribeBody = z.object({
  planId: z.enum(PLANS.map((p) => p.id)),
});

const statusBody = z.object({ isPremium: z.boolean() });

const webhookBody = z.object({
  event: z.object({
    id: z.string().min(1).max(128),
    type: z.string().min(1).max(64),
    app_user_id: z.string().min(1).max(128),
    original_app_user_id: z.string().max(128).nullish(),
    aliases: z.array(z.string().max(128)).max(50).nullish(),
    transferred_from: z.array(z.string().max(128)).max(50).nullish(),
    transferred_to: z.array(z.string().max(128)).max(50).nullish(),
    product_id: z.string().max(128).nullish(),
    expiration_at_ms: z.number().nullish(),
    grace_period_expiration_at_ms: z.number().nullish(),
  }).passthrough(),
}).passthrough();

module.exports = { subscribeBody, statusBody, webhookBody };
