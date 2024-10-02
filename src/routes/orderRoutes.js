const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const ManageController = require('../controllers/manageController');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.get('/getOrders', (req, res, next) => authMiddleware(req, res, next), OrderController.getOrders);
router.get('/getTables', (req, res, next) => authMiddleware(req, res, next), OrderController.getTables);
router.post('/updateTablePosition', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.updateTablePosition);
router.post('/updateTableOrderId', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.updateTableOrderId);
router.post('/createTable', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.createTable);
router.post('/removeTable', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.removeTable);
router.post('/createOrder', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.createOrder);
router.post('/updateOrder', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.updateOrder);
router.post('/updateOrderStatus', (req, res, next) => authMiddleware(req, res, next, '/pos'), OrderController.updateOrderStatus);
router.get('/receipt/:id', (req, res, next) => authMiddleware(req, res, next), OrderController.generateReceipt);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;