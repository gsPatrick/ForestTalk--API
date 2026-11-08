const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, request, newClient } = require('../../test/helpers');

before(startServer);
after(stopServer);

test('registra aparelho anônimo e devolve token', async () => {
  const { status, body } = await request('POST', '/v1/devices', { body: { platform: 'android', appVersion: '1.0.0' } });
  assert.equal(status, 201);
  assert.ok(body.data.deviceId && body.data.token);
});

test('rejeita plataforma inválida com VALIDATION_ERROR', async () => {
  const { status, body } = await request('POST', '/v1/devices', { body: { platform: 'palm' } });
  assert.equal(status, 400);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('rota protegida exige token e aceita o token emitido', async () => {
  assert.equal((await request('GET', '/v1/devices/me')).status, 401);
  const client = await newClient();
  const me = await client.get('/v1/devices/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.data.deviceId, client.deviceId);
});

test('health responde e rota desconhecida dá 404 padronizado', async () => {
  const ping = await request('GET', '/v1/ping');
  assert.equal(ping.status, 200);
  assert.equal(ping.body.data.db, 'up');
  const lost = await request('GET', '/v1/nada');
  assert.equal(lost.status, 404);
  assert.equal(lost.body.error.code, 'ROUTE_NOT_FOUND');
});
