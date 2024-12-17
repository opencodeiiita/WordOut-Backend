const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "name": { type: String, required: true },
    "email": { type: String, required: true },
    "password": { type: String, required: true },
    "last_online": { type: Date, default: null },  // Adding last_online field
    //for forget password routes
    resetPasswordToken : String,
    resetPasswordExpires : Date,
    hashedResetCode: String,
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
