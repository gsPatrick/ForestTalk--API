/** Encaminha erros de handlers async para o middleware de erro. */
module.exports = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
