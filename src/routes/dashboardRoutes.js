const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const DashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.post('/getDashboardStats', (req, res, next) => authMiddleware(req, res, next, '/dashboard'), DashboardController.getDashboardStats);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;