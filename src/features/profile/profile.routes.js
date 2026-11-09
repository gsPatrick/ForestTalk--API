const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./profile.controller');
const schema = require('./profile.schema');

// Montado em /v1/languages junto de outras features: `auth` por rota.
const router = Router();
router.get('/:code/profile', auth, validate({ params: schema.codeParams }), controller.profile);

module.exports = router;
