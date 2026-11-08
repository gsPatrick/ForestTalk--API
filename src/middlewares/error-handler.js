const { ZodError } = require('zod');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const AppError = require('../utils/app-error');
const env = require('../config/env');

const notFound = (req, _res, next) => next(AppError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let error = err;
  if (err instanceof ZodError) error = AppError.badRequest('Dados inválidos', 'VALIDATION_ERROR', err.issues);
  else if (err instanceof UniqueConstraintError) error = AppError.conflict('Registro já existe', 'ALREADY_EXISTS');
  else if (err instanceof ValidationError) error = AppError.badRequest(err.message, 'VALIDATION_ERROR');
  else if (err.type === 'entity.parse.failed') error = AppError.badRequest('JSON inválido', 'INVALID_JSON');

  if (!(error instanceof AppError)) {
    if (env.LOG_LEVEL !== 'silent') console.error(err);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } });
  }
  const body = { code: error.code, message: error.message };
  if (error.details) body.details = error.details;
  return res.status(error.statusCode).json({ error: body });
};

module.exports = { notFound, errorHandler };
