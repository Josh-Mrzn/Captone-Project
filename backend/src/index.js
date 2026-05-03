import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initSockets } from './sockets/socket.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// ====================== CORS (PUT FIRST) ======================
app.use(cors({
  origin: 'http://localhost:5173', // your React app
  credentials: true
}));
app.get('/test', (req, res) => res.send('Server is alive!'));

// ====================== MIDDLEWARE ======================
app.use(express.json());
app.use(cookieParser());

// ====================== ROUTES ======================
app.use('/api', routes);
app.use('/api/chat', chatRoutes);

// ====================== MONGO DB ======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🚀 MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ====================== SERVER & SOCKETS ======================
const server = http.createServer(app);

// Initialize WebSocket
initSockets(server);

server.listen(port, () => {
  console.log("✅ Server is running");
  console.log("ENV CHECK:", {
    PORT: process.env.PORT,
    JWT: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    MONGO: process.env.MONGODB_URI ? 'SET' : 'NOT SET'
  });
});
