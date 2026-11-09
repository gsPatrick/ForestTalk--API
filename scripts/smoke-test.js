/* eslint-disable no-console */
// Smoke test: percorre o fluxo principal contra uma API já rodando (npm run dev).
// Uso: API_URL=http://localhost:3333/api npm run smoke:test
const API_URL = (process.env.API_URL || 'http://localhost:3333/api').replace(/\/$/, '');
const LANG = 'en';

let token;
const state = {};

async function call(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* corpo não-JSON */ }
  return { status: res.status, json, data: json?.data, error: json?.error };
}

function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

function expectOk(r, what) {
  expect(r.status >= 200 && r.status < 300, `${what}: HTTP ${r.status} ${r.error ? `${r.error.code} - ${r.error.message}` : ''}`);
  expect(r.data !== undefined, `${what}: resposta sem "data"`);
}

const steps = [
  ['ping', async () => {
    const r = await call('GET', '/v1/ping');
    expectOk(r, 'ping');
    expect(r.data.db === 'up', 'banco fora do ar');
  }],
  ['registrar aparelho anônimo', async () => {
    const r = await call('POST', '/v1/devices', { platform: 'web', appVersion: 'smoke' });
    expectOk(r, 'devices');
    token = r.data.token;
    expect(token && r.data.deviceId, 'sem token/deviceId');
  }],
  ['listar idiomas', async () => {
    const r = await call('GET', '/v1/languages');
    expectOk(r, 'languages');
    expect(Array.isArray(r.data) && r.data.length === 5, 'esperava 5 idiomas');
  }],
  ['trilha (capítulos)', async () => {
    const r = await call('GET', `/v1/languages/${LANG}/chapters`);
    expectOk(r, 'chapters');
    expect(Array.isArray(r.data) && r.data.length > 0, 'trilha vazia');
  }],
  ['completar fase 1', async () => {
    const r = await call('POST', `/v1/languages/${LANG}/phases/1/complete`, { stars: 3, coinsEarned: 10 });
    expectOk(r, 'complete');
  }],
  ['abrir progresso', async () => {
    const r = await call('GET', `/v1/languages/${LANG}/progress`);
    expectOk(r, 'progress');
  }],
  ['perfil do idioma', async () => {
    const r = await call('GET', `/v1/languages/${LANG}/profile`);
    expectOk(r, 'profile');
    expect(r.data.stats.phasesCompleted >= 1, 'perfil sem a fase 1 concluída');
  }],
  ['abrir baú, desbloquear carta e receber power-ups (como o app)', async () => {
    expectOk(await call('POST', `/v1/languages/${LANG}/chests/5/open`, { coins: 30 }), 'chest');
    expectOk(await call('POST', '/v1/collection/unlock', { animalId: 'rabbit' }), 'unlock');
    expectOk(await call('POST', '/v1/power-ups/grant', { hint: 1 }), 'grant');
    expectOk(await call('POST', '/v1/wallet/earn', { amount: 5 }), 'earn');
  }],
  ['carteira', async () => {
    const r = await call('GET', '/v1/wallet');
    expectOk(r, 'wallet');
    state.coins = r.data.coins;
  }],
  ['loja: listar e comprar kit sem saldo falha', async () => {
    const list = await call('GET', '/v1/shop/items');
    expectOk(list, 'shop/items');
    const items = Array.isArray(list.data) ? list.data : list.data.items;
    expect(Array.isArray(items) && items.length > 0, 'loja vazia');
    const priciest = [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
    const buy = await call('POST', `/v1/shop/items/${priciest.id}/buy`);
    expectOk(buy, 'buy');
    expect(buy.data.result === 'notEnoughCoins', `esperava notEnoughCoins, veio ${buy.data.result}`);
  }],
  ['simulações exigem Premium (403 antes de assinar)', async () => {
    const r = await call('GET', '/v1/sim/scenarios');
    expect(r.status === 403 && r.error?.code === 'PREMIUM_REQUIRED', `esperava 403 PREMIUM_REQUIRED, veio ${r.status}`);
  }],
  ['assinatura: planos e assinar (modo teste)', async () => {
    const plans = await call('GET', '/v1/subscription/plans');
    expectOk(plans, 'plans');
    const sub = await call('POST', '/v1/subscription', { planId: plans.data[0].id });
    expectOk(sub, 'subscribe');
    const status = await call('GET', '/v1/subscription');
    expectOk(status, 'status');
    expect(status.data.isPremium === true, 'Premium não ativou');
  }],
  ['ler uma fase de cada jogo', async () => {
    // Cada jogo cobre 30 fases: verdadeiro/falso 1–30, pares 31–60, tradução 61–90, pronúncia 91–120.
    for (const [game, phase] of [['true-false', 1], ['pairs', 31], ['translation', 61], ['pronunciation', 91]]) {
      expectOk(await call('GET', `/v1/languages/${LANG}/phases/${phase}/${game}`), `jogo ${game}`);
    }
  }],
  ['listar simulações e abrir um cenário', async () => {
    const list = await call('GET', '/v1/sim/scenarios');
    expectOk(list, 'scenarios');
    expect(Array.isArray(list.data) && list.data.length > 0, 'sem cenários');
    expectOk(await call('GET', `/v1/sim/scenarios/${list.data[0].id}?lang=${LANG}`), 'cenário');
  }],
  ['conversa: personagens e enviar mensagem', async () => {
    const chars = await call('GET', '/v1/chat/characters');
    expectOk(chars, 'chat/characters');
    expect(Array.isArray(chars.data) && chars.data.length > 0, 'sem personagens');
    const msg = await call('POST', '/v1/chat', { characterId: chars.data[0].id, languageCode: LANG, text: 'Hello!', turn: 0 });
    expectOk(msg, 'chat');
    expect(typeof msg.data.text === 'string', 'resposta sem text');
  }],
  ['cancelar assinatura', async () => {
    const r = await call('DELETE', '/v1/subscription');
    expectOk(r, 'cancel');
    expect(r.data.isPremium === false, 'Premium não cancelou');
  }],
];

(async () => {
  console.log(`Smoke test em ${API_URL}\n`);
  let failed = 0;
  for (const [name, fn] of steps) {
    try {
      await fn();
      console.log(`✅ ${name}`);
    } catch (err) {
      failed += 1;
      console.log(`❌ ${name}\n   ${err.message}`);
    }
  }
  console.log(`\n${steps.length - failed}/${steps.length} passos OK`);
  process.exit(failed ? 1 : 0);
})();
