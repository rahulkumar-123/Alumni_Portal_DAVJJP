const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Import the Message model to save chats to the database
const Message = require('./models/Message');
const User = require('./models/User');


// --- INITIAL SETUP ---
dotenv.config();
connectDB();
const app = express();


// --- NEW, ROBUST CORS CONFIGURATION ---
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
// --- CREATE HTTP SERVER & SOCKET.IO INSTANCE ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});


// --- REAL-TIME CONNECTION LOGIC ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // When a user joins a specific group's chat
    socket.on('join_group', (groupId) => {
        socket.join(groupId);
        console.log(`User with ID: ${socket.id} joined group: ${groupId}`);
    });

    // When a user sends a message
    socket.on('send_message', async (data) => {
        const { groupId, senderId, text } = data;

        if (!groupId || !senderId || !text) {
            return console.log("Missing data for send_message event");
        }

        try {
            // 1. Save the message to the database
            const messageToSave = new Message({
                group: groupId,
                sender: senderId,
                text: text
            });
            let savedMessage = await messageToSave.save();

            // We now populate `batchYear` and `profilePicture` in addition to the other fields.
            savedMessage = await savedMessage.populate('sender', 'fullName profilePicture batchYear');

            // 2. Broadcast the saved message to everyone in the group's room
            io.to(groupId).emit('receive_message', savedMessage);
        } catch (error) {
            console.error("Error saving or broadcasting message:", error);
        }
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// --- STATIC FOLDER AND API ROUTES ---
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/messages', require('./routes/messages'));


// --- START THE SERVER ---
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server with real-time chat running on port ${PORT}`));
