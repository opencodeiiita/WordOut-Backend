const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const authRouter = require('./routes/signup');
require('./config/db.config');
const friendRoutes = require('./routes/friendRoutes'); // Adjust path as necessary


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api', authRouter);
app.use('/api/friends', friendRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to WordOut Backend");
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('user-online', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online`);
    });

    socket.on('send-game-invitation', ({ fromUserId, toUserId }) => {
        const receiverSocketId = onlineUsers.get(toUserId);

        if (!receiverSocketId) {
            socket.emit('game-request-response', { toUserId, status: 'Offline' });
            return;
        }

        io.to(receiverSocketId).emit('receive-game-invitation', { fromUserId });

        const timeout = setTimeout(() => {
            socket.emit('game-request-response', { toUserId, status: 'Timeout' });
        }, 10000);

        socket.on('game-invitation-response', ({ toUserId, status }) => {
            if (toUserId === fromUserId) {
                clearTimeout(timeout);
                socket.emit('game-request-response', { toUserId, status });
            }
        });
    });

    socket.on('disconnect', () => {
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} went offline`);
                break;
            }
        }
    });
});

server.listen(4000, () => {
    console.log("Server is running on port 4000");
});
