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
    getTodaysBirthdays
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
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});


// All routes below are protected
router.use(protect);

router.route('/')
    .get(getUsers);

router.route('/profile')
    .put(updateProfile);

router.route('/profile/picture')
    .put(upload.single('profileImage'), updateProfilePicture);

router.route('/pending')
    .get(admin, getPendingRegistrations);

router.route('/approve/:id')
    .put(admin, approveRegistration);

router.route('/birthdays/today').get(getTodaysBirthdays);

router.route('/:id')
    .get(getUser)
    .delete(admin, deleteUser);

module.exports = router;

