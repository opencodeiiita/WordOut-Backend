const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "name": { type: String, required: true },
    "email": { type: String, required: true },
    "password": { type: String, required: true },
    "last_online": { type: Date, default: null }, // Adding last_online field
    "blockedUsers": [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }] // This field stores the blocked users
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
