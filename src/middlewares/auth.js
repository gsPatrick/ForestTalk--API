const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/app-error');

/** Exige `Authorization: Bearer <token>` (emitido em POST /v1/devices). Preenche `req.device = { id }`. */
const auth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(AppError.unauthorized());
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.device = { id: payload.sub };
    return next();
  } catch {
    return next(AppError.unauthorized('Token inválido ou expirado', 'INVALID_TOKEN'));
  }
};

module.exports = auth;
