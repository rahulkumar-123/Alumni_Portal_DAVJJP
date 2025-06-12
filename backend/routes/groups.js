const express = require('express');
const { createGroup, getGroups, joinGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').post(createGroup).get(getGroups);
router.route('/:id/join').put(joinGroup);

module.exports = router;
