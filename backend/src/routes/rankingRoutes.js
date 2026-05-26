const { Router } = require('express');
const { index } = require('../controllers/rankingController');

const router = Router();
router.get('/', index);

module.exports = router;