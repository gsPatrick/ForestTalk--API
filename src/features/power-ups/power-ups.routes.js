const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./power-ups.controller');
const schema = require('./power-ups.schema');

const router = Router();
router.use(auth);
router.get('/', controller.get);
router.post('/consume', validate({ body: schema.consumeBody }), controller.consume);
router.post('/grant', validate({ body: schema.grantBody }), controller.grant);

module.exports = router;
