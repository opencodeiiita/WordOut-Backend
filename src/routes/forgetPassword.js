const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { promisify } = require('util');
const transporter = require('../middlewares/transporter.middleware');
const User = require('../models/UserModel');
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not present.' });
        }

        const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour expiration
        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const hashedCode = await bcrypt.hash(resetCode.toString(), 12);

        await User.findOneAndUpdate(
            { email: req.body.email },
            { 
                resetPasswordToken: token, 
                resetPasswordExpires: expiration,
                hashedResetCode: hashedCode 
            },
            { new: true }
        );
        
        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>You are receiving this because you (or someone else) requested a password reset.</p>
                <p>Your verification code is: <strong>${resetCode}</strong></p>
                <p>This code will expire in 1 hour.</p>
            `
        });

        res.status(200).json({ 
            token, 
            message: 'Check your email for the verification code' 
        });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.post('/forgot-password/verify/:token', async (req, res) => {
    try {
        if (!req.body.code) {
            return res.status(400).json({ message: 'Verification code is required' });
        }

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const isValid = await bcrypt.compare(req.body.code.toString(), user.hashedResetCode);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        res.status(200).json({ 
            token: req.params.token, 
            message: 'Verification code is valid' 
        });
    } catch (error) {
        console.error("Error verifying reset code:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }   
});

router.post('/forgot-password/set-password/:token', async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const newPassword = await bcrypt.hash(req.body.password, 12);
        await User.findByIdAndUpdate(user._id, {
            password: newPassword,
            $unset: { 
                resetPasswordToken: "", 
                resetPasswordExpires: "", 
                hashedResetCode: "" 
            }
        });

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;