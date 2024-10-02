const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const ProductController = require('../controllers/productController');
const ProductCategoryController = require('../controllers/productCategoryController');

const router = express.Router();

router.post('/getProducts', (req, res, next) => authMiddleware(req, res, next), ProductController.getProducts);
router.post('/updateProduct', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductController.updateProduct);
router.post('/createProduct', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductController.createProduct);
router.post('/removeProduct', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductController.removeProduct);
router.post('/uploadProductImg', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductController.uploadProductImg);

// product categories
router.get('/getCategories', (req, res, next) => authMiddleware(req, res, next), ProductCategoryController.getCategories);
router.post('/createCategory', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductCategoryController.createCategory);
router.post('/removeCategory', (req, res, next) => authMiddleware(req, res, next, '/products'), ProductCategoryController.removeCategory);


// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;