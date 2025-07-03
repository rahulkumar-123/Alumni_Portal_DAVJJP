const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const parseMentions = (text) => {
    if (!text) return [];
    const mentionRegex = /@\[(.+?)\]\(\w+\)/g;
    const matches = text.match(mentionRegex);
    if (!matches) return [];
    return matches.map(match => match.substring(2, match.indexOf(']')));
};

const sendNotification = async (req, notificationData) => {
    const { io, userSockets } = req;
    try {
        const notification = await Notification.create(notificationData);
        const recipientSocketId = userSockets.get(notification.recipient.toString());

        if (recipientSocketId) {
            const populatedNotification = await Notification.findById(notification._id).populate([
                { path: 'sender', select: 'fullName profilePicture' },
                { path: 'post', select: 'title' },
                { path: 'group', select: 'name' }
            ]);
            io.to(recipientSocketId).emit('new_notification', populatedNotification);
        }

        const unreadCount = await Notification.countDocuments({ recipient: notification.recipient, read: false });
        if (unreadCount === 10) {
            const recipient = await User.findById(notification.recipient);
            if (recipient) {
                sendEmail({
                    email: recipient.email,
                    subject: "You've Got Unread Notifications!",
                    message: `<p>Hey ${recipient.fullName}, you have 10+ unread notifications waiting for you on the Alumni Portal. Come see what you've missed!</p>`
                });
            }
        }
    } catch (error) { console.error("Error sending notification:", error); }
};
module.exports = { parseMentions, sendNotification };