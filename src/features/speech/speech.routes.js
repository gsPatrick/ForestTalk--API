const { Router } = require('express');
const auth = require('../../middlewares/auth');
const requirePremium = require('../../middlewares/require-premium');
const validate = require('../../middlewares/validate');
const { speechLimiter } = require('../../middlewares/rate-limit');
const controller = require('./speech.controller');
const { speakBody } = require('./speech.schema');

// Voz do personagem (ElevenLabs): Premium, como a conversa. Sem chave, o app usa a voz do aparelho.
const router = Router();
router.use(auth, requirePremium, speechLimiter);
router.post('/', validate({ body: speakBody }), controller.speak);

module.exports = router;
