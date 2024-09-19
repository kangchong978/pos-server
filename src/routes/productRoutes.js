const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.post('/getProducts', (req, res, next) => authMiddleware(req, res, next, 'admin'), ProductController.getProducts);
router.post('/updateProduct', (req, res, next) => authMiddleware(req, res, next, 'admin'), ProductController.updateProduct);
router.post('/createProduct', (req, res, next) => authMiddleware(req, res, next, 'admin'), ProductController.createProduct);
router.post('/removeProduct', (req, res, next) => authMiddleware(req, res, next, 'admin'), ProductController.removeProduct);
router.post('/uploadProductImg', (req, res, next) => authMiddleware(req, res, next, 'admin'), ProductController.uploadProductImg);

// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;