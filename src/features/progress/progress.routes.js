const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./progress.controller');
const schema = require('./progress.schema');

// Montado em /v1/languages junto de outras features: `auth` por rota (nunca `router.use`).
const router = Router();
router.get('/:code/chapters', auth, validate({ params: schema.codeParams }), controller.chapters);
router.get('/:code/progress', auth, validate({ params: schema.codeParams }), controller.progress);
router.post(
  '/:code/phases/:n/complete',
  auth,
  validate({ params: schema.phaseParams, body: schema.completeBody }),
  controller.complete,
);
router.post(
  '/:code/chests/:after/open',
  auth,
  validate({ params: schema.chestParams, body: schema.chestBody }),
  controller.chest,
);

module.exports = router;
