const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['new_comment', 'new_post', 'mention_comment', 'mention_chat'] },
    post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    read: { type: Boolean, default: false },
    // A snippet of the content for context in the notification
    contentSnippet: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);