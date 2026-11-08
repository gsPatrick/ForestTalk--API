const PREMIUM_PLAN_ID = 'premium_monthly';

/** Catálogo do MVP (espelha `PremiumCatalog.plans` do app): plano único mensal. */
const PLANS = [
  { id: PREMIUM_PLAN_ID, title: 'Mensal', price: 'R$ 39,90', period: '/mês', highlighted: true },
];

/** Tipos de evento do RevenueCat que deixam/mantêm o Premium ativo. */
const ACTIVATING_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
];

module.exports = { PREMIUM_PLAN_ID, PLANS, ACTIVATING_EVENTS };
