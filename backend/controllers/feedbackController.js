const Feedback = require('../models/Feedback');

// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const feedback = await Feedback.create({
            user: req.user.id,
            subject,
            message
        });
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private/Admin
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (error) {
        console.error("Error in getFeedbacks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
