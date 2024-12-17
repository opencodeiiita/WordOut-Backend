const express = require('express');
const userModel = require('../models/UserModel');
const FriendRequestModel = require('../models/FriendRequestModel');
const router = express.Router();
// const { blockUser, unblockUser, getBlockedUsers } = require('../controllers/blockController');
// Existing Friend Request Routes

// Route 1: Send a Friend Request
router.post('/friend-request/:receiverId', async (req, res) => {
    try {
        const { userId } = req.body;
        const receiverId = req.params.receiverId;

        if (userId === receiverId) {
            return res.status(400).json({ message: "You can't send a friend request to yourself!" });
        }

        const existingRequest = await FriendRequestModel.findOne({ sender: userId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent!' });
        }

        const friendRequest = new FriendRequestModel({ sender: userId, receiver: receiverId });
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent!', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
});

// Route 2: Accept or Reject a Friend Request
router.post('/friend-request/respond/:requestId', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status!' });
        }

        const friendRequest = await FriendRequestModel.findByIdAndUpdate(
            req.params.requestId,
            { status },
            { new: true }
        );

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        res.status(200).json({ message: `Friend request ${status}!`, friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error responding to friend request', error });
    }
});

// Route 3: Get All Friend Requests for a User
router.get('/friend-requests/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const requests = await FriendRequestModel.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('sender receiver', 'name email');

        res.status(200).json({ message: 'Friend requests fetched', requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend requests', error });
    }
});

// Route 4: Get Status of a Specific Friend Request
router.get('/friend-request/status/:requestId', async (req, res) => {
    try {
        const friendRequest = await FriendRequestModel.findById(req.params.requestId).populate('sender receiver', 'name email');
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        res.status(200).json({ message: 'Friend request status fetched', status: friendRequest.status, friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend request status', error });
    }
});

// New Routes for Online/Offline Status

// Route 1: Mark Player as Online
router.post('/mark-online/:userId', async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.userId, { last_online: null }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User marked as online', user });
    } catch (error) {
        res.status(500).json({ message: 'Error marking user as online', error });
    }
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


// New Routes for blocking/unblocking and retrieve the users in blocked list

// Route 1: Block a User
router.post('/block', async (req, res) => {
    try {
        const { userId, blockedUserId } = req.body;

        if (userId === blockedUserId) {
            return res.status(400).json({ message: "You can't block yourself!" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.blockedUsers.includes(blockedUserId)) {
            return res.status(400).json({ message: 'User is already blocked!' });
        }

        user.blockedUsers.push(blockedUserId);
        await user.save();

        res.status(200).json({ message: `User ${blockedUserId} blocked successfully!`, blockedUsers: user.blockedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error });
    }
});

// Route 2: Unblock a User
router.post('/unblock', async (req, res) => {
    try {
        const { userId, blockedUserId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.blockedUsers.includes(blockedUserId)) {
            return res.status(400).json({ message: 'User is not in your blocked list!' });
        }

        user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== blockedUserId);
        await user.save();

        res.status(200).json({ message: `User ${blockedUserId} unblocked successfully!`, blockedUsers: user.blockedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking user', error });
    }
});

// Route 3: Get All Blocked Users for a User
router.get('/blocked-users/:userId', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId).populate('blockedUsers', 'name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Blocked users fetched successfully', blockedUsers: user.blockedUsers });
    } catch (error) {
        console.error('Error fetching blocked users:', error); // Log the full error
        res.status(500).json({ message: 'Error fetching blocked users', error: error.message });
    }
});

module.exports = router;
