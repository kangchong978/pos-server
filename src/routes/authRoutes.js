const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', (req, res, next) => authMiddleware(req, res, next, 'admin'), AuthController.register);
router.post('/remove', (req, res, next) => authMiddleware(req, res, next, 'admin'), AuthController.remove);
router.post('/updateUser', (req, res, next) => authMiddleware(req, res, next, 'admin'), AuthController.updateUser);
router.post('/resetPassword', (req, res, next) => authMiddleware(req, res, next), AuthController.resetPassword);
router.post('/logout', (req, res, next) => authMiddleware(req, res, next), AuthController.logout);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;