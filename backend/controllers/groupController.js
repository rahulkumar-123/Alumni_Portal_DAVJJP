const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
    req.body.creator = req.user.id;
    req.body.members = [req.user.id];
    const group = await Group.create(req.body);
    res.status(201).json({ success: true, data: group });
};

exports.getGroups = async (req, res) => {
    const groups = await Group.find().populate('creator', 'fullName').populate('members', 'fullName');
    res.status(200).json({ success: true, data: groups });
};

exports.joinGroup = async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group.members.includes(req.user.id)) {
        group.members.push(req.user.id);
        await group.save();
    }
    res.status(200).json({ success: true, data: group });
};
