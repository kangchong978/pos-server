
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const SalesController = require('../controllers/salesController');

const router = express.Router();

// New sales routes
router.post('/recordSale', (req, res, next) => authMiddleware(req, res, next, '/pos'), SalesController.recordSale);
router.get('/totalSales', (req, res, next) => authMiddleware(req, res, next), SalesController.getTotalSales);
router.get('/averageTransactionValue', (req, res, next) => authMiddleware(req, res, next), SalesController.getAverageTransactionValue);
router.get('/salesByCategory', (req, res, next) => authMiddleware(req, res, next), SalesController.getSalesByCategory);
router.get('/salesByPaymentMethod', (req, res, next) => authMiddleware(req, res, next), SalesController.getSalesByPaymentMethod);
router.get('/salesByTime', (req, res, next) => authMiddleware(req, res, next), SalesController.getSalesByTime);
router.get('/topSellingProducts', (req, res, next) => authMiddleware(req, res, next), SalesController.getTopSellingProducts);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;