const { Router } = require('express');
const { loginHandler, cadastroHandler, definirSenhaHandler } = require('../controllers/authController');

const router = Router();
router.post('/login', loginHandler);
router.post('/cadastro', cadastroHandler);
router.post('/definir-senha', definirSenhaHandler);

module.exports = router;