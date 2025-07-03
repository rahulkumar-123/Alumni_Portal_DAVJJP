const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// --- INITIAL SETUP ---
dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
    "https://davjjp-alumni-crhfw.ondigitalocean.app",
    "https://alumni-portal-davjjp.vercel.app",
    "http://localhost:3000",
    "https://alumni-davjjp.netlify.app"
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// --- SOCKET.IO SETUP ---
const io = new Server(server, { cors: corsOptions });

// In-memory map to track which user ID belongs to which socket connection
const userSockets = new Map();

// Middleware to pass io and userSockets to controllers
app.use((req, res, next) => {
    req.io = io;
    req.userSockets = userSockets;
    next();
});

// --- REAL-TIME CONNECTION LOGIC ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // When a user logs in, the frontend will send their ID to be mapped
    socket.on('user_connected', (userId) => {
        if (userId) {
            userSockets.set(userId.toString(), socket.id);
            console.log(`Mapped user ${userId} to socket ${socket.id}`);
        }
    });

    // When a user joins a specific group chat
    socket.on('join_group', (groupId) => {
        socket.join(groupId);
        console.log(`User with ID: ${socket.id} joined group: ${groupId}`);
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        // Find and remove the user from our map to prevent memory leaks
        for (let [userId, id] of userSockets.entries()) {
            if (id === socket.id) {
                userSockets.delete(userId);
                console.log(`Unmapped user ${userId}`);
                break;
            }
        }
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// --- API ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

// --- START THE SERVER ---
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server with real-time chat running on port ${PORT}`));
