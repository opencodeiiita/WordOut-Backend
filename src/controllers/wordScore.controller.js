const User = require("../models/UserModel");

// 1. Get current WordScore
const getWordScore = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ wordScore: user.wordScore });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 2. Increase WordScore
const increaseWordScore = async (req, res) => {
    const { increment } = req.body;

    if (increment <= 0) {
        return res.status(400).json({ message: "Increment must be positive" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.wordScore += increment;
        await user.save();

        res.status(200).json({ message: "WordScore increased", wordScore: user.wordScore });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 3. Decrease WordScore
const decreaseWordScore = async (req, res) => {
    const { decrement } = req.body;

    if (decrement <= 0) {
        return res.status(400).json({ message: "Decrement must be positive" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.wordScore = Math.max(user.wordScore - decrement, 0); // Ensure it doesn't go below 0
        await user.save();

        res.status(200).json({ message: "WordScore decreased", wordScore: user.wordScore });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getWordScore, increaseWordScore, decreaseWordScore };
