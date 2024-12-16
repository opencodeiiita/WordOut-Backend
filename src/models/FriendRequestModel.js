const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const FriendRequestModel = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequestModel;
