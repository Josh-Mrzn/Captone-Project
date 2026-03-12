import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';   // loads .env variables

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Optional: JSON support (if you want to send/receive JSON later)
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is working',
    dbConnected: mongoose.connection.readyState === 1 ? 'yes' : 'no'
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
﻿

