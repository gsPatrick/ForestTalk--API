const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./devices.controller');
const schema = require('./devices.schema');

const router = Router();
router.post('/', validate({ body: schema.registerBody }), controller.register);
router.get('/me', auth, controller.me);

module.exports = router;
