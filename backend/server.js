// import statements
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');

// loads environment variables from a .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// middleware
// CORS allows requests from different origins
// express.json() allows the server to parse JSON in request bodies.
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Manchester United Fan Hub API');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));