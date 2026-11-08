const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./game-content.controller');
const { phaseParams } = require('./game-content.schema');

const router = Router();
const guard = [auth, validate({ params: phaseParams })];
router.get('/:code/phases/:n/true-false', ...guard, controller.trueFalse);
router.get('/:code/phases/:n/pairs', ...guard, controller.pairs);
router.get('/:code/phases/:n/translation', ...guard, controller.translation);
router.get('/:code/phases/:n/pronunciation', ...guard, controller.pronunciation);

module.exports = router;
