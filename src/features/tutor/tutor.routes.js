const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const c = require('./tutor.controller');
const s = require('./tutor.schema');

const router = Router();
router.use(auth);
router.get('/lessons', validate({ query: s.languageQuery }), c.lessons);
router.post('/sessions', validate({ body: s.createBody }), c.create);
router.post('/sessions/:id/turn', validate({ params: s.idParams, body: s.turnBody }), c.turn);
router.post('/sessions/:id/complete', validate({ params: s.idParams, body: s.completeBody }), c.complete);
router.get('/progress', validate({ query: s.languageQuery }), c.progress);
router.get('/settings', c.getSettings);
router.put('/settings', validate({ body: s.settingsBody }), c.saveSettings);

module.exports = router;
