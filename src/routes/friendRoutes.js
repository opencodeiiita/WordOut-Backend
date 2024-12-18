const express = require('express');
const router = express.Router();
const FriendRequestModel = require('../models/FriendRequestModel');
const UserModel = require('../models/UserModel'); 


router.get('/search', async (req, res) => {
    const { userId, name, email } = req.query;

    try {
      
        const acceptedRequests = await FriendRequestModel.find({
            status: 'accepted',
            $or: [{ sender: userId }, { receiver: userId }],
        });

        const friendIds = acceptedRequests.map(request =>
            request.sender.toString() === userId ? request.receiver : request.sender
        );

        const query = { _id: { $in: friendIds } };
        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };

        const friends = await UserModel.find(query);
        res.status(200).json({ success: true, data: friends });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching friends', error: error.message });
    }
});

module.exports = router;
