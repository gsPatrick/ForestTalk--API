const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const { getLanguagesSummary } = require('./profile-languages.service');

const languages = catchAsync(async (req, res) => ok(res, await getLanguagesSummary(req.device.id)));

module.exports = { languages };
