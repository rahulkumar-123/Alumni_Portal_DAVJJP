const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { uploadToCloudinary } = require("../utils/cloudinary");

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
        console.error("Error in getUsers:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || (!user.isApproved && req.user.role !== "admin")) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error in getUser:", error);
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

        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) delete fieldsToUpdate[key];
        });

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @access  Private
exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        const cloudinaryUrl = await uploadToCloudinary(req.file);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: cloudinaryUrl },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error in updateProfilePicture:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
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
        console.error("Error in getTodaysBirthdays:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// --- Admin specific controllers ---

// @access  Private/Admin
exports.getPendingRegistrations = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false })
            .select('+fullName +email +batchYear +admissionNumber +dateOfBirth');

        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error("Error in getPendingRegistrations:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private/Admin
exports.approveRegistration = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        try {
            await sendEmail({
                email: user.email,
                subject: `🎉 ${user.fullName} Welcome Home! Your Alumni Account is Now Active 🙌`,
                message: `
                    <h2>Dear ${user.fullName}!</h2>
                    <p>It’s official; your account on the MNJ DAV Alumni Portal has been approved! 🚀</p>
                    <p>After all these years, we finally have a place where DAVians from every batch can reconnect, relive memories, and rebuild the bond that never really broke.<br>
                    No more “yaar uska number hai kya?”<br>
                    No more lost connections.<br>
                    Just one portal — and the whole DAV family is a click away.<br>
                    </p>
                    <p> Here’s what’s waiting for you inside:<br>
                    🧑‍🤝‍🧑 Alumni Directory – Search and reconnect with old friends & even stalk old classmates (pyaar se, obviously 😅)<br>
                    💬 Real-time Group Chats – jaise tiffin time pe hoti thi <br>
                    📰 Community Feed – Share job openings, news, or just school-time stories<br>
                    🎂 Birthday cards – kyunki wish toh banta hai na!<br>
                    👤 Your Profile - batao duniya ko ki DAVian kya katr rahe hai (Nahi bhi kar rahe ho to KAR LENGE! afterall we are DAVians)<br>
                    👉 Log in now: <a href= "https://alumni-portal-davjjp.vercel.app"> https://alumni-portal-davjjp.vercel.app </a><br>
                    </p>
                    <p>
                    We may not be wearing uniforms anymore, but the memories are still stitched into our hearts.</p>
                    <p>Thank you for joining!</p>
                    <p> – With nostalgia, warmth, and a lot of samose wali yaadein,<br>
                    Your MNJ DAV Alumni Family</p>
                `,
            });
        } catch (emailError) {
            console.error("Failed to send approval email:", emailError);
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error in approveRegistration:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
