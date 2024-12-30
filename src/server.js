const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const authRouter = require('./routes/signup');
const wordScoreRoutes = require("./routes/wordScore.routes");
require('./config/db.config');
const friendRoutes = require('./routes/friendRoutes'); // Adjust path as necessary


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use("/api/wordScore", wordScoreRoutes);
app.use('/api', authRouter);
app.use('/api/friends', friendRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to WordOut Backend");
});

const onlineUsers = new Map();

const gameRooms = {};

function getPlayerCount(roomId) {
    return gameRooms[roomId] ? gameRooms[roomId].length : 0;
}

function getPlayerRoomId(socketId) {
    for (const roomId in gameRooms) {
        const room = gameRooms[roomId];

        const index = room.findIndex(player => player.socketId === socketId);
        if(index != -1){
            return roomId; //returns room id
        }
    }
    return false; //returns false on failing
}

function isRoomFull(roomId) {
    return getPlayerCount(roomId) > 6;
}

function assignImpostor(roomId) {
    if (!isRoomFull(roomId)) {
        return false;
    }

    const impostorIndex = Math.floor(Math.random() * gameRooms[roomId].length);
    const impostor = gameRooms[roomId][impostorIndex];
    
    io.to(impostor.socketId).emit('role-assigned', { role:"impostor", message: "You are the impostor!" });
    return impostor;
} 

io.on('connection', (socket) => {
    console.log('New player connected: ' + socket.id);

    // Event triggered when a player joins a game room
    socket.on('player-join-request', (roomId, playerName) => {
        if(getPlayerRoomId(socket.id) != false){
            socket.emit('player-join-response', {status: "Fail", message: "Please leave existing room before joining a new one."});
            console.error(`Player '${socket.id}' tried joining room '${roomId}' while already connected to another one.`);
            return;
        }

        if (!gameRooms[roomId]) {
            gameRooms[roomId] = [];
        }

        // Check if the room is full
        if (isRoomFull(roomId)) {
            socket.emit('player-join-response', {status: "RoomFull"});
            return;
        }

        gameRooms[roomId].push({ socketId: socket.id, playerName });

        console.log(`Player: '${socket.id}' joined room: '${roomId}'`);

        socket.join(roomId);
        socket.emit('player-join-response', {status: "Success", roomId});

        io.to(roomId).emit('updatePlayersList', gameRooms[roomId]);

        // If the room is full, assign the impostor
        if (isRoomFull(roomId)) {
            const impostor = assignImpostor(roomId);
            if(impostor == false){
                console.error(`Failed to assign impostor for room '${roomId}'`);
            } else {
                console.log(`Impostor for room '${roomId}' is '${impostor.playerName}' (${impostor.socketId})`);
            }
        }
    });

    // Event triggered when a player leaves the room
    socket.on('player-leave-request', () => {
        const roomId = getPlayerRoomId(socket.id);
        if(roomId == false){
            socket.emit('player-leave-response', {status: "Fail", message: 'Player is not in any room.'});
            console.error(`Player '${socket.id}' tried to leave a room while not being in one.`);
            return;
        }

        const room = gameRooms[roomId];
        const index = room.findIndex(player => player.socketId === socket.id);
        room.splice(index, 1);

        console.log(`Player: '${socket.id}' left room: '${roomId}'`);
        socket.leave(roomId);
        socket.emit('player-leave-response', {status: "Success"});

        io.to(roomId).emit('updatePlayersList', room);
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log(`Player disconnected: '${socket.id}'`);

        // Check if player is part of any room and remove them
        for (const roomId in gameRooms) {
            const room = gameRooms[roomId];
            const index = room.findIndex(player => player.socketId === socket.id);

            if (index !== -1) {
                room.splice(index, 1);
                io.to(roomId).emit('updatePlayersList', room); 
                console.log(`Player '${socket.id}' left room '${roomId}' due to disconnect`);
                break;
            }
        }
    });
});


io.on('connection', (socket) => {
    console.log(`User connected: '${socket.id}'`);

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
