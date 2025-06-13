const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination(req, file, cb) { cb(null, 'uploads/'); },
//     filename(req, file, cb) { cb(null, `post-${Date.now()}${path.extname(file.originalname)}`); }
// });
// const upload = multer({ storage /*, fileFilter can be added here */ });

const {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPendingPosts,
    addComment,
    deleteComment,
    approvePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPosts)
    .post(createPost);

router.route('/:id/comment').post(addComment);
router.route('/:id/comment/:comment_id').delete(deleteComment);

router.route('/pending')
    .get(admin, getPendingPosts);

router.route('/approve/:id')
    .put(admin, approvePost);

router.route('/:id')
    .put(updatePost)
    .delete(deletePost);

module.exports = router;

