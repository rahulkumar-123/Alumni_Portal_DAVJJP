const express = require('express');
const { 
    createGroup, 
    getGroups, 
    joinGroup, 
    getGroupDetails
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// This route handles getting all groups and creating a new one
router.route('/')
    .get(getGroups)
    .post(createGroup);

router.route('/:id')
    .get(getGroupDetails);

// This route handles joining a group
router.route('/:id/join')
    .put(joinGroup);

module.exports = router;