const express = require('express');
const {
    submitFeedback,
    getFeedbacks
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validateFeedback } = require('../middleware/validationMiddleware');
const router = express.Router();

router.use(protect);

router.route('/')
    .post(validateFeedback, submitFeedback)
    .get(admin, getFeedbacks);

module.exports = router;
