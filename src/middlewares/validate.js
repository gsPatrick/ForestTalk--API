const AppError = require('../utils/app-error');

/**
 * Valida body/params/query com Zod antes do controller.
 * Os valores já validados (e convertidos) ficam em `req.valid.{body,params,query}`.
 */
const validate = (schemas) => (req, _res, next) => {
  const valid = {};
  for (const part of ['params', 'query', 'body']) {
    if (!schemas[part]) continue;
    const result = schemas[part].safeParse(req[part] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ in: part, path: i.path.join('.'), message: i.message }));
      return next(AppError.badRequest('Dados inválidos', 'VALIDATION_ERROR', details));
    }
    valid[part] = result.data;
  }
  req.valid = valid;
  return next();
};

module.exports = validate;
