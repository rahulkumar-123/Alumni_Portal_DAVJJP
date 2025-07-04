const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

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
            return res.status(400).json({ success: false, message: 'Missing credentials' });
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

        return sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Send a success response even if user not found to prevent email enumeration
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Create reset token that expires in 15 minutes
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });

        // Create reset url
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">🔒 Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">
            You recently requested to reset your password. Click the button below to proceed.
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" clicktracking=off style="background-color:rgb(160, 42, 233); color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
            </a>
        </div>
        <p style="font-size: 14px; color: #888;">
            This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
            If the button above doesn't work, copy and paste the following link into your browser:<br/>
            <a href="${resetUrl}" style="color:rgb(7, 115, 248);">${resetUrl}</a>
        </p>
    </div>
`;


        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });

        res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        // Don't reveal server errors, send a generic success message
        res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.resettoken;
        const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });

    } catch (error) {
        // Catches expired tokens or other JWT errors
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};

// @access  Private
exports.getMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('+phoneNumber +instagramProfile');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

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
            role: user.role
        }
    });
};
