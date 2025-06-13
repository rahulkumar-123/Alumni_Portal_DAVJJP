const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @access  Private
exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 21; // Default to 21 for 3 rows of 7
    const startIndex = (page - 1) * limit;

    try {
        const { batchYear, currentOrganization, location } = req.query;
        const filter = { isApproved: true };

        if (batchYear && !isNaN(parseInt(batchYear))) filter.batchYear = parseInt(batchYear);
        if (currentOrganization) filter.currentOrganization = { $regex: currentOrganization, $options: 'i' };
        if (location) filter.location = { $regex: location, $options: 'i' };

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .sort({ fullName: 1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: users.length,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            },
            data: users
        });
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
            instagramProfile: req.body.instagramProfile,
            facebookProfile: req.body.facebookProfile,
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
exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const user = await User.findById(req.user.id);

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
    const users = await User.find({ isApproved: false })
        .select('+fullName +email +batchYear +admissionNumber +dateOfBirth');
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

