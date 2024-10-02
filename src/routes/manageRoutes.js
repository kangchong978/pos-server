const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const ManageController = require('../controllers/manageController');

const router = express.Router();

router.get('/getUsers', (req, res, next) => authMiddleware(req, res, next), ManageController.getUsers);
router.get('/getRoutesAuth', (req, res, next) => authMiddleware(req, res, next), ManageController.getRoutesAuth);
router.post('/updateRoutesAuth', (req, res, next) => authMiddleware(req, res, next, '/settings'), ManageController.updateRoutesAuth);
router.get('/getSettings', (req, res, next) => authMiddleware(req, res, next), ManageController.getSettings);
router.post('/updateSettings', (req, res, next) => authMiddleware(req, res, next, '/settings'), ManageController.updateSettings);
router.post('/uploadCompanyLogo', (req, res, next) => authMiddleware(req, res, next, '/settings'), ManageController.uploadCompanyLogo);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;