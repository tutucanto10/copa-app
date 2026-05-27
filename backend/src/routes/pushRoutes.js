const { Router } = require('express');
const { subscribe, publicKey, notificar } = require('../controllers/pushController');
const { verificarAdmin } = require('../../middleware/adminAuth');

const router = Router();
router.get('/public-key', publicKey);
router.post('/subscribe', subscribe);
router.post('/notificar', verificarAdmin, notificar);

module.exports = router;
