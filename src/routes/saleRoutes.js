
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const SalesController = require('../controllers/salesController');

const router = express.Router();

// New sales routes
router.post('/recordSale', (req, res, next) => authMiddleware(req, res, next, '/pos'), SalesController.recordSale);
router.get('/getSales', (req, res, next) => authMiddleware(req, res, next), SalesController.getSales);
router.get('/receipt/:id', (req, res, next) => authMiddleware(req, res, next), SalesController.generateReceipt);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;