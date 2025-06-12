const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @access  Public
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, batchYear, admissionNumber, dateOfBirth } = req.body;

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            batchYear,
            admissionNumber,
            dateOfBirth
        });

        res.status(201).json({ success: true, message: 'Registration successful. Please wait for admin approval.' });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isApproved) {
            return res.status(403).json({ success: false, message: 'Your account has not been approved by an admin yet.' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


exports.getMe = async (req, res) => {

    res.status(200).json({ success: true, data: req.user });
};

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        }
    });
};
