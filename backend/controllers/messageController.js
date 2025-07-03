const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');
const { parseMentions, sendNotification } = require('../utils/notificationManager');

exports.getMessagesForGroup = async (req, res) => {
    const messages = await Message.find({ group: req.params.groupId }).populate('sender', 'fullName profilePicture').sort('createdAt');
    res.status(200).json({ success: true, data: messages });
};

exports.postMessage = async (req, res) => {
    const { text } = req.body;
    const { groupId } = req.params;
    const senderId = req.user.id;
    try {
        const message = await Message.create({ group: groupId, sender: senderId, text });
        const populatedMessage = await Message.findById(message._id).populate('sender', 'fullName profilePicture batchYear');
        req.io.to(groupId).emit('receive_message', populatedMessage);

        const group = await Group.findById(groupId);
        if (group) {
            group.members.forEach(memberId => {
                if (memberId.toString() !== senderId) {
                    sendNotification(req, { recipient: memberId, sender: senderId, type: 'new_group_message', group: groupId, contentSnippet: text.substring(0, 50) + '...' });
                }
            });
        }

        const mentionedUsernames = parseMentions(text);
        if (mentionedUsernames.length > 0) {
            const mentionedUsers = await User.find({ fullName: { $in: mentionedUsernames } });
            mentionedUsers.forEach(mentionedUser => {
                if (mentionedUser._id.toString() !== senderId && group.members.includes(mentionedUser._id)) {
                    sendNotification(req, { recipient: mentionedUser._id, sender: senderId, type: 'mention_chat', group: groupId, contentSnippet: text.substring(0, 50) + '...' });
                }
            });
        }
        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

