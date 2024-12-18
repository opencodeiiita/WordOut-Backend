const express = require("express");
const router = express.Router();
const {
    getWordScore,
    increaseWordScore,
    decreaseWordScore,
} = require("../controllers/wordScore.controller");

// Route to get current WordScore
router.get("/:id", getWordScore);

// Route to increase WordScore
router.post("/:id/increase", increaseWordScore);

// Route to decrease WordScore
router.post("/:id/decrease", decreaseWordScore);

module.exports = router;
