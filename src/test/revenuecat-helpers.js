// Apoio aos testes do webhook do RevenueCat: um listener próprio, porque o `request` dos testes
// não envia o header Authorization cru que o RevenueCat usa.
const app = require('../../app');
const env = require('../config/env');

const realFetch = global.fetch;
const SECRET = 'segredo-webhook';
let server;
let seq = 0;

const startHookServer = () => new Promise((resolve) => { server = app.listen(0, resolve); });
const stopHookServer = () => new Promise((resolve) => server.close(resolve));

async function webhook(event, auth) {
  const url = `http://127.0.0.1:${server.address().port}${env.API_PREFIX}/v1/subscription/webhook/revenuecat`;
  const res = await realFetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(auth ? { authorization: auth } : {}) },
    body: JSON.stringify({ event }),
  });
  return { status: res.status, body: await res.json() };
}

/** Envia um evento com id único e o header correto (ou o `auth` informado). */
const sendWebhook = (event, auth = SECRET) => webhook({ id: `ev-${Date.now()}-${seq++}`, ...event }, auth);

module.exports = { startHookServer, stopHookServer, webhook, sendWebhook, SECRET };
