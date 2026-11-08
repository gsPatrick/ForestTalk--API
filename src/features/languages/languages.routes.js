const { Router } = require('express');
const controller = require('./languages.controller');

const router = Router();
router.get('/', controller.list); // pública

module.exports = router;
