const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// --- static folder for uploads ---
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/messages', require('./routes/messages'));


// Simple route for testing
app.get('/', (req, res) => {
    res.send('Alumni Portal API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

