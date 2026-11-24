const PREMIUM_PLAN_ID = 'premium_monthly';
const ADS_FREE_PLAN_ID = 'ads_free_monthly';

/** Catálogo (espelha `PremiumCatalog.plans` do app): Premium primeiro, depois o plano só sem anúncios. */
const PLANS = [
  {
    id: PREMIUM_PLAN_ID,
    title: 'Premium',
    price: 'R$ 39,90',
    period: '/mês',
    highlighted: true,
    note: 'Sem anúncios + Professor de IA + Simulações + vidas infinitas',
  },
  { id: ADS_FREE_PLAN_ID, title: 'Sem anúncios', price: 'R$ 9,90', period: '/mês', note: 'Remove os anúncios' },
];

/** Planos que removem os anúncios (os dois). Só o Premium libera IA, Simulações e vidas infinitas. */
const ADS_FREE_PLAN_IDS = [PREMIUM_PLAN_ID, ADS_FREE_PLAN_ID];

/** Tipos de evento do RevenueCat que deixam/mantêm o plano ativo. */
const ACTIVATING_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
];

/** Plano a partir do product id da loja (ex.: `com.foresttalk.app.ads_free_monthly`); null se não reconhecer. */
function planFromProductId(productId) {
  if (!productId) return null;
  return PLANS.find((p) => productId === p.id || productId.includes(p.id))?.id ?? null;
}

module.exports = { PREMIUM_PLAN_ID, ADS_FREE_PLAN_ID, ADS_FREE_PLAN_IDS, PLANS, ACTIVATING_EVENTS, planFromProductId };
