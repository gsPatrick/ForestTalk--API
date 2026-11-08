const AppError = require('../../utils/app-error');

/** Erro padrão da IA para o app: 502 `AI_UNAVAILABLE` (o `reason` é só para diagnóstico). */
const aiUnavailable = (reason) =>
  new AppError(502, 'AI_UNAVAILABLE', 'Serviço de IA indisponível no momento', reason ? { reason } : undefined);

module.exports = { aiUnavailable };
