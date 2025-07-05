const express = require('express');
const RateLimit = require('express-rate-limit');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const forgotPasswordLimiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute.'
});
const resetPasswordLimiter = RateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many attempts to reset password. Please try again later." // Custom error message
})
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.put('/reset-password/:resettoken', resetPasswordLimiter, resetPassword);

module.exports = router;

