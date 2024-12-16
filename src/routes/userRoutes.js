const express = require('express');
const userModel = require('../models/UserModel'); // Adjust path as needed
const router = express.Router();

// Route 1: Mark Player as Online
router.post('/mark-online/:userId', async (req, res) => {{
  try {
    const user = await userModel.findByIdAndUpdate(req.params.userId, { last_online: null }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User marked as online', user });
  } catch (error) {
    res.status(500).json({ message: 'Error marking user as online', error });
  }}
});

// Route 2: Mark Player as Offline
router.post('/mark-offline/:userId', async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.userId, { last_online: new Date() }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User marked as offline', user });
  } catch (error) {
    res.status(500).json({ message: 'Error marking user as offline', error });
  }
});

// Route 3: Get Last Online of a User
router.get('/last-online/:userId', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.last_online === null) {
      return res.status(200).json({ message: 'User is online', last_online: null });
    }

    const lastOnline = user.last_online;
    const formattedDate = `${lastOnline.getDate().toString().padStart(2, '0')}-${(lastOnline.getMonth() + 1).toString().padStart(2, '0')}-${lastOnline.getFullYear()}(${lastOnline.getHours().toString().padStart(2, '0')}:${lastOnline.getMinutes().toString().padStart(2, '0')})`;

    res.status(200).json({ message: 'Last online time', last_online: formattedDate });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching last online', error });
  }
});

module.exports = router;
