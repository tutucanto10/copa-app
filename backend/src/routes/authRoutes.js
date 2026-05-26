const { Router } = require('express');
const { loginHandler, cadastroHandler } = require('../controllers/authController');

const router = Router();
router.post('/login', loginHandler);
router.post('/cadastro', cadastroHandler);

module.exports = router;