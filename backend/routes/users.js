const express = require('express');
const path = require('path');
const multer = require('multer');

const {
    getUsers,
    getUser,
    updateProfile,
    getPendingRegistrations,
    approveRegistration,
    deleteUser,
    updateProfilePicture,
    getTodaysBirthdays,
    searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();


// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// important routes
// All routes below are protected by default
router.use(protect);


// Route to get all users (with pagination)
router.route('/')
    .get(getUsers);

// Route for @mention user search. MUST come before /:id
router.route('/search')
    .get(searchUsers);

// Route to update the logged-in user's profile text data
router.route('/profile')
    .put(updateProfile);

// Route to update the logged-in user's profile picture using Cloudinary
router.route('/profile/picture')
    .put(upload.single('profileImage'), updateProfilePicture);

// Route to get today's birthdays
router.route('/birthdays/today')
    .get(getTodaysBirthdays);


// --- Admin Only Routes ---

// Route for admin to get pending user registrations
router.route('/pending')
    .get(admin, getPendingRegistrations);

// Route for admin to approve a user
router.route('/approve/:id')
    .put(admin, approveRegistration);

// Route for admin to get or delete a specific user. This MUST be last.
router.route('/:id')
    .get(admin, getUser)
    .delete(admin, deleteUser);

module.exports = router;
