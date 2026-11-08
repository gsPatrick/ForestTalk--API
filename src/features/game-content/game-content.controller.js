const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const { getPhaseItems } = require('./game-content.service');

// Conteúdo imutável por versão: ETag forte + cache privado de 1 dia (Express devolve 304 sozinho).
const handler = (kind) =>
  catchAsync(async (req, res) => {
    const { code, n } = req.valid.params;
    const { items, etag } = getPhaseItems(kind, code, n);
    res.set({ ETag: etag, 'Cache-Control': 'private, max-age=86400' });
    return ok(res, items);
  });

module.exports = {
  trueFalse: handler('true-false'),
  pairs: handler('pairs'),
  translation: handler('translation'),
  pronunciation: handler('pronunciation'),
};
