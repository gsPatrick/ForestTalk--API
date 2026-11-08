const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./collection.controller');
const schema = require('./collection.schema');

const router = Router();
router.use(auth);
router.get('/', controller.get);
router.post('/unlock', validate({ body: schema.unlockBody }), controller.unlock);
router.put('/equipped', validate({ body: schema.equipBody }), controller.equip);

module.exports = router;
