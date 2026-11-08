const { Router } = require('express');
const auth = require('../../middlewares/auth');
const requirePremium = require('../../middlewares/require-premium');
const validate = require('../../middlewares/validate');
const controller = require('./simulations.controller');
const { langQuery, idParams, completeBody } = require('./simulations.schema');

const router = Router();
router.use(auth, requirePremium);

router.get('/scenarios', controller.list);
router.get('/scenarios/:id', validate({ params: idParams, query: langQuery }), controller.get);
router.post('/scenarios/:id/complete', validate({ params: idParams, body: completeBody }), controller.complete);
router.get('/completions', validate({ query: langQuery }), controller.completions);

module.exports = router;
