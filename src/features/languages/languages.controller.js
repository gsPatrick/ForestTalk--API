const { ok } = require('../../utils/respond');
const { listLanguages } = require('./languages.service');

const list = (_req, res) => ok(res, listLanguages());

module.exports = { list };
