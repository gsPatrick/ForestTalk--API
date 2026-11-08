const { Router } = require('express');
const auth = require('../../middlewares/auth');
const requirePremium = require('../../middlewares/require-premium');
const validate = require('../../middlewares/validate');
const controller = require('./chat.controller');
const { startBody, sendBody, suggestionsQuery } = require('./chat.schema');

const router = Router();
router.use(auth, requirePremium);

router.get('/characters', controller.characters);
router.post('/start', validate({ body: startBody }), controller.start);
router.get('/suggestions', validate({ query: suggestionsQuery }), controller.suggestions);
router.post('/', validate({ body: sendBody }), controller.send);

module.exports = router;
