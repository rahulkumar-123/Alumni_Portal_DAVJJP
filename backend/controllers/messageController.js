const Message = require('../models/Message');

exports.getMessagesForGroup = async (req, res) => {
    const messages = await Message.find({ group: req.params.groupId }).populate('sender', 'fullName profilePicture').sort('createdAt');
    res.status(200).json({ success: true, data: messages });
};

exports.postMessage = async (req, res) => {
    const newMessage = {
        group: req.params.groupId,
        sender: req.user.id,
        text: req.body.text
    };
    const message = await Message.create(newMessage);
    res.status(201).json({ success: true, data: message });
};
