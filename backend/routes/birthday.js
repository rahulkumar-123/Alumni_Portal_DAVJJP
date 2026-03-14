const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Health check endpoint — requires authentication for consistency
router.get('/health', protect, (req, res) => {
    res.json({
        success: true,
        message: 'Birthday system is running automatically',
        data: {
            systemStatus: 'Active',
            schedule: 'Every day at 6:00 AM IST',
            timezone: 'Asia/Kolkata'
        }
    });
});

module.exports = router;
