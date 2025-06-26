const Post = require('../models/Post');
const User = require('../models/User');

// @access  Private
exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    try {
        const total = await Post.countDocuments({ isApproved: true });
        const posts = await Post.find({ isApproved: true })
            .populate('user', 'fullName profilePicture role')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: posts.length,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            },
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @access  Private
exports.createPost = async (req, res) => {
    try {
        req.body.user = req.user.id;
        // Admin posts are auto-approved
        if (req.user.role === 'admin') {
            req.body.isApproved = true;
        }

        const post = await Post.create(req.body);

        const message = req.user.role === 'admin' ? 'Post created successfully.' : 'Post submitted for approval.';

        res.status(201).json({ success: true, data: post, message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this post' });
        }

        // Admin auto approves on edit, user posts need re-approval
        if (req.user.role !== 'admin') {
            req.body.isApproved = false;
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        const message = req.user.role === 'admin' ? 'Post updated successfully.' : 'Post updated and submitted for re-approval.';

        res.status(200).json({ success: true, data: post, message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user is post owner or admin
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private
exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const alreadyLiked = post.likes.some(like => like.user.toString() === req.user.id);

        if (alreadyLiked) {
            // Unlike the post
            post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
        } else {
            // Like the post
            post.likes.push({ user: req.user.id });
        }

        await post.save();

        res.status(200).json({ success: true, data: post.likes });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.myLikeStatus = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const liked = post.likes.some(like => like.user.toString() === req.user.id);
        res.status(200).json({ success: true, liked });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// --- Admin specific post controllers ---

// @access  Private/Admin
exports.getPendingPosts = async (req, res) => {
    const posts = await Post.find({ isApproved: false }).populate('user', 'fullName');
    res.status(200).json({ success: true, count: posts.length, data: posts });
};

// @access  Private/Admin
exports.approvePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post, message: 'Post approved' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const newComment = {
            text: req.body.text,
            user: req.user.id,
            name: req.user.fullName,
        };

        post.comments.unshift(newComment);
        await post.save();

        res.status(201).json({ success: true, data: post.comments });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = post.comments.find(c => c.id === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Check if user is the comment owner or an admin
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        post.comments = post.comments.filter(c => c.id !== req.params.comment_id);
        await post.save();

        res.status(200).json({ success: true, data: {} });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


