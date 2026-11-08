const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./wallet.controller');
const schema = require('./wallet.schema');

const router = Router();
router.use(auth);
router.get('/', controller.get);
router.post('/spend', validate({ body: schema.spendBody }), controller.spend);
router.post('/earn', validate({ body: schema.earnBody }), controller.earn);

module.exports = router;
