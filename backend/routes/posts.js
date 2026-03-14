const express = require('express');

const {
    getPosts,
    createPost,
    deletePost,
    addComment,
    getPostById,
    likePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validatePost, validateComment } = require('../middleware/validationMiddleware');
const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPosts)
    .post(validatePost, createPost);

router.route('/:id/comment').post(validateComment, addComment);

router.route('/:id/like').put(likePost);

router.route('/:id').get(getPostById).delete(deletePost);


module.exports = router;
