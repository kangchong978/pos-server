const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', (req, res, next) => authMiddleware(req, res, next, '/employees'), AuthController.register);
router.post('/remove', (req, res, next) => authMiddleware(req, res, next, '/employees'), AuthController.remove);
router.post('/updateUser', (req, res, next) => authMiddleware(req, res, next, '/employees'), AuthController.updateUser);
router.post('/resetPassword', (req, res, next) => authMiddleware(req, res, next), AuthController.resetPassword);
router.post('/requestResetPassword', (req, res, next) => authMiddleware(req, res, next), AuthController.requestResetPassword);
router.post('/logout', (req, res, next) => authMiddleware(req, res, next, undefined, true), AuthController.logout);
router.post('/refreshAccessToken', (req, res, next) => authMiddleware(req, res, next, undefined, undefined, true), AuthController.refreshAccessToken);
router.get('/loadUserInfo', (req, res, next) => authMiddleware(req, res, next), AuthController.loadUserInfo);


// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;