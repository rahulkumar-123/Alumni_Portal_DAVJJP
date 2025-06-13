const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
// there is no requirem
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        let query;

        if (req.user.role === 'admin') {
            query = User.find();
        } else {
            // Alumni directory search and filter
            const reqQuery = { ...req.query, isApproved: true };

            const removeFields = ['select', 'sort', 'page', 'limit'];
            removeFields.forEach(param => delete reqQuery[param]);

            let queryStr = JSON.stringify(reqQuery);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

            query = User.find(JSON.parse(queryStr));
        }

        const users = await query;
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.isApproved && req.user.role !== 'admin') {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            fullName: req.body.fullName,
            bio: req.body.bio,
            currentOrganization: req.body.currentOrganization,
            location: req.body.location,
            linkedInProfile: req.body.linkedInProfile,
            phoneNumber: req.body.phoneNumber,
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private
// added uplaods folder to the path
exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const user = await User.findById(req.user.id);
      //  is this line necessary?
        user.profilePicture = `/${req.file.path.replace(/\\/g, "/")}`; // Normalize path for web

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: updatedUser
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private
exports.getTodaysBirthdays = async (req, res) => {
    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1; 
        const todayDay = today.getDate();

        const users = await User.find({
            isApproved: true,
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: '$dateOfBirth' }, todayDay] },
                    { $eq: [{ $month: '$dateOfBirth' }, todayMonth] }
                ]
            }
        });

        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- Admin specific controllers ---

// @access  Private/Admin
exports.getPendingRegistrations = async (req, res) => {
    const users = await User.find({ isApproved: false });
    res.status(200).json({ success: true, count: users.length, data: users });
};


// @access  Private/Admin
exports.approveRegistration = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Account has been Approved!',
                message: `
                    <h1>Welcome, ${user.fullName}!</h1>
                    <p>Your account for the MNJ DAV Alumni Portal has been approved by an administrator.</p>
                    <p>You can now log in and access all the features of the portal.</p>
                    <p>Thank you for joining!</p>
                `
            });
        } catch (emailError) {
            console.error("Failed to send approval email:", emailError);

        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

