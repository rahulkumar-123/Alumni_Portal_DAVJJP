const Group = require('../models/Group');

// Creates a new group
exports.createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ success: false, message: 'Please provide a name and description.' });
        }

        const group = await Group.create({
            name,
            description,
            creator: req.user.id,
            members: [req.user.id],
        });
        res.status(201).json({ success: true, data: group });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Gets all groups
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('creator', 'fullName').populate('members', 'fullName');
        res.status(200).json({ success: true, data: groups });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Joins the current user to a group
exports.joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found.' });
        }
        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
            await group.save();
        }
        res.status(200).json({ success: true, data: group, message: 'Successfully joined group!' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Gets details for a single group
exports.getGroupDetails = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found.' });
        }
        res.status(200).json({ success: true, data: group });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// checks if the user is a member of the group
exports.isGroupMember = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found.' });
        }
        const isMember = group.members.includes(req.user.id);
        res.status(200).json({ success: true, isMember });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}