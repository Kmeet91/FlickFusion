import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { GridFSBucket } from 'mongodb';
import tmdbRoutes from './routes/tmdbRoutes.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messageRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database & GridFS Connection ---
const mongoURI = process.env.MONGO_URI;
let bucket;

mongoose.connect(mongoURI);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Connection Error:'));
conn.once('open', () => {
    bucket = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    console.log('Database & GridFS Bucket Initialized... - server.js:35');
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/admin', adminRoutes); 

// --- CORRECTED ROUTE TO SERVE IMAGES ---
app.get('/api/image/:filename', (req, res) => {
    if (!bucket) {
        return res.status(500).json({ err: 'GridFS not initialized' });
    }

    // Use the bucket to open a download stream by filename
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

    // Handle stream errors, like file not found
    downloadStream.on('error', (err) => {
        if (err.code === 'ENOENT') { // ENOENT means "File Not Found"
            return res.status(404).json({ err: 'File does not exist' });
        }
        return res.status(500).json({ err: 'Error streaming file' });
    });

    // Pipe the image data directly to the response
    downloadStream.pipe(res);
});

// --- Server and Socket.IO Setup ---
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected: - server.js:79', socket.id);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId} - server.js:82`);
    });
    socket.on('send-playback-action', ({ roomId, action, time }) => {
        socket.to(roomId).emit('receive-playback-action', { action, time });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected: - server.js:88', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT} - server.js:93`));