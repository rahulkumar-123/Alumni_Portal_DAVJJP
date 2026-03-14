const express = require('express');
const {
    createGroup,
    getGroups,
    joinGroup,
    getGroupDetails,
    isGroupMember,
    leaveGroup,
    deleteGroup
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validateGroupCreation } = require('../middleware/validationMiddleware');
const router = express.Router();

router.use(protect);

// This route handles getting all groups and creating a new one
router.route('/')
    .get(getGroups)
    .post(validateGroupCreation, createGroup);

router.route('/:id')
    .get(getGroupDetails);

router.route('/:id/isGroupMember')
    .get(isGroupMember);

router.route('/:id/join')
    .put(joinGroup);

router.route('/:id/leave')
    .put(leaveGroup);

router.route('/:id')
    .delete(admin, deleteGroup);

module.exports = router;