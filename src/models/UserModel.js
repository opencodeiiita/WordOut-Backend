const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    last_online: { type: Date, default: null }, // Field to track last online time
    // Fields for forgot password functionality
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hashedResetCode: String,
    // Field for blocking users
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Stores IDs of blocked users
    bio: { type: String, trim: true, default: '' }, 
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
