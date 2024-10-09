const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const FeedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.post('/recordEmployeeFeedback', (req, res, next) => authMiddleware(req, res, next), FeedbackController.recordEmployeeFeedback);
router.get('/getEmployeeFeedbacks', FeedbackController.getEmployeeFeedbacks);


// Log routes for debugging
console.log('Registered routes:');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

module.exports = router;