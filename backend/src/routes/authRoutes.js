const { Router } = require('express');
const { loginHandler, cadastroHandler, definirSenhaHandler, esqueceuSenhaHandler } = require('../controllers/authController');

const router = Router();
router.post('/login', loginHandler);
router.post('/cadastro', cadastroHandler);
router.post('/definir-senha', definirSenhaHandler);
router.post('/esqueci-senha', esqueceuSenhaHandler);

module.exports = router;