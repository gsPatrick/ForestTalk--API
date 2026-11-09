const { Router } = require('express');
const auth = require('../../middlewares/auth');
const controller = require('./profile-languages.controller');

// Montado em /v1/profile: resumo por idioma do aparelho.
const router = Router();
router.get('/languages', auth, controller.languages);

module.exports = router;
