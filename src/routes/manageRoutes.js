const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const ManageController = require('../controllers/manageController');

const router = express.Router();

router.get('/getUsers', (req, res, next) => authMiddleware(req, res, next, 'admin'), ManageController.getUsers);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;