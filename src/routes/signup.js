const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');

const router = express.Router();

router.post('/signup', [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .trim(),
    
    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .trim()
        .normalizeEmail(),
    
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation Errors:', errors.array());
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { 
                userId: newUser._id, 
                email: newUser.email 
            },
            process.env.JWT_SECRET || 'fallback_secret', 
            { 
                expiresIn: '24h' 
            }
        );

        res.status(201).header('Authorization', `Bearer ${token}`).json({
            status: 'success',
            message: 'User registered successfully',
            userId: newUser._id,
            token // Include the token in the response body
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration'
        });
    }
});

module.exports = router;
