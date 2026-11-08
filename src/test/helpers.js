// Apoio aos testes: sobe o app numa porta livre e oferece `api()` com token já registrado.
const app = require('../../app');
const { sequelize } = require('../models');
const env = require('../config/env');

let server;
let baseUrl;

async function startServer() {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}${env.API_PREFIX}`;
}

async function stopServer() {
  await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
}

/** Chamada HTTP real; devolve `{ status, body }`. */
async function request(method, path, { body, token } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.headers.get('content-type')?.startsWith('audio/')) {
    return { status: res.status, body: Buffer.from(await res.arrayBuffer()), type: res.headers.get('content-type') };
  }
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

/** Registra um aparelho novo e devolve um cliente já autenticado (`get/post/put/del`). */
async function newClient() {
  const { body } = await request('POST', '/v1/devices', { body: { platform: 'ios' } });
  const { deviceId, token } = body.data;
  return {
    deviceId,
    token,
    get: (path) => request('GET', path, { token }),
    post: (path, data) => request('POST', path, { body: data ?? {}, token }),
    put: (path, data) => request('PUT', path, { body: data ?? {}, token }),
    del: (path) => request('DELETE', path, { token }),
  };
}

module.exports = { startServer, stopServer, request, newClient };
