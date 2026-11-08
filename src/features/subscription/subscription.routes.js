const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const controller = require('./subscription.controller');
const schema = require('./subscription.schema');

const router = Router();

// Webhook: sem auth de aparelho (o próprio serviço valida o header Authorization).
router.post('/webhook/revenuecat', validate({ body: schema.webhookBody }), controller.revenuecatWebhook);

router.get('/plans', auth, controller.plans);
router.get('/', auth, controller.status);
router.post('/', auth, validate({ body: schema.subscribeBody }), controller.subscribe);
router.put('/status', auth, validate({ body: schema.statusBody }), controller.premiumStatus);
router.delete('/', auth, controller.unsubscribe);
router.post('/restore', auth, controller.restorePurchases);

module.exports = router;
