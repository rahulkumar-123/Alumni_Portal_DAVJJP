const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.ObjectId, ref: 'Group', required: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
}, { timestamps: true });

// Compound index for fetching messages per group sorted by date
MessageSchema.index({ group: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
