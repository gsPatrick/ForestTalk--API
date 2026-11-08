/** Formato único de sucesso: `{ data }`. Erros saem como `{ error: { code, message, details? } }`. */
const ok = (res, data, status = 200) => res.status(status).json({ data });
const created = (res, data) => ok(res, data, 201);
const noContent = (res) => res.status(204).end();

module.exports = { ok, created, noContent };
