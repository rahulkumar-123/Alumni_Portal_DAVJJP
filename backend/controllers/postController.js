
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// --- HELPER FUNCTIONS ---

// Function to parse @mentions from text
const parseMentions = (text) => {
    if (!text) return [];
    const mentionRegex = /@(\w+)/g;
    const mentions = text.match(mentionRegex);
    if (!mentions) return [];
    // Return array of usernames without '@'
    return mentions.map(mention => mention.substring(1));
};

// Function to create and push notifications in real-time
const sendNotification = async (req, notificationData) => {
    const { io, userSockets } = req;
    try {
        const notification = await Notification.create(notificationData);
        const recipientSocketId = userSockets.get(notification.recipient.toString());

        if (recipientSocketId) {
            const populatedNotification = await notification.populate([
                { path: 'sender', select: 'fullName profilePicture' },
                { path: 'post', select: 'title' }
            ]);
            io.to(recipientSocketId).emit('new_notification', populatedNotification);
        }
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};


// --- CONTROLLER EXPORTS ---

// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    try {
        const total = await Post.countDocuments({ isApproved: true });
        const posts = await Post.find({ isApproved: true })
            .populate('user')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
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

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const images = req.files ? req.files.map(file => file.path) : [];

        const post = await Post.create({
            ...req.body,
            images,
            user: req.user.id,
            isApproved: true, // All posts are auto-approved
        });

        res.status(201).json({ success: true, data: post, message: 'Post created successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        // User can delete their own post OR an admin can delete any post
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
        }
        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user');
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

        // --- Notification Logic ---
        // Notify post author
        if (post.user._id.toString() !== req.user.id) {
            await sendNotification(req, {
                recipient: post.user._id,
                sender: req.user.id,
                type: 'new_comment',
                post: post._id,
                contentSnippet: req.body.text.substring(0, 50) + '...',
            });
        }

        // Notify mentioned users
        const mentionedUsernames = parseMentions(req.body.text);
        if (mentionedUsernames.length > 0) {
            const mentionedUsers = await User.find({ fullName: { $in: mentionedUsernames } });
            mentionedUsers.forEach(mentionedUser => {
                if (mentionedUser._id.toString() !== post.user._id.toString() && mentionedUser._id.toString() !== req.user.id) {
                    sendNotification(req, {
                        recipient: mentionedUser._id,
                        sender: req.user.id,
                        type: 'mention_comment',
                        post: post._id,
                        contentSnippet: req.body.text.substring(0, 50) + '...',
                    });
                }
            });
        }

        res.status(201).json({ success: true, data: post.comments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
