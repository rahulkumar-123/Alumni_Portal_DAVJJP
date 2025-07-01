const express = require('express');
const { getNotifications, markNotificationsAsRead, markOneNotificationAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').get(getNotifications);
router.route('/mark-read').put(markNotificationsAsRead);
router.route('/:id/mark-read').put(markOneNotificationAsRead);

module.exports = router;