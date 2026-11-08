const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./shop.controller');
const schema = require('./shop.schema');

const router = Router();
router.use(auth);
router.get('/items', controller.items);
router.post('/items/:id/buy', validate({ params: schema.buyParams }), controller.buy);

module.exports = router;
