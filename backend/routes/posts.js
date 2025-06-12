const express = require('express');
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

