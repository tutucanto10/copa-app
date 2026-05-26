const { Router } = require('express');
const { index, store } = require('../controllers/rodadaController');

const router = Router();
router.get('/', index);
router.post('/', store);

module.exports = router;
