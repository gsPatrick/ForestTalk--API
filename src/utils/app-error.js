/** Erro de negócio com status HTTP e `code` estável para o cliente. */
class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message, code = 'BAD_REQUEST', details) {
    return new AppError(400, code, message, details);
  }

  static unauthorized(message = 'Autenticação necessária', code = 'UNAUTHORIZED') {
    return new AppError(401, code, message);
  }

  static forbidden(message, code = 'FORBIDDEN') {
    return new AppError(403, code, message);
  }

  static notFound(message = 'Recurso não encontrado', code = 'NOT_FOUND') {
    return new AppError(404, code, message);
  }

  static conflict(message, code = 'CONFLICT') {
    return new AppError(409, code, message);
  }
}

module.exports = AppError;
