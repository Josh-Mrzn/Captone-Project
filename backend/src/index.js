// backend/src/index.js
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

// ====================== MIDDLEWARE ======================
app.use(express.json());
app.use(cookieParser());

// ====================== ROUTES ======================
app.use('/api', routes);   // All API routes under /api

// ====================== MONGO DB ======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => console.error(' MongoDB connection error:', err));

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});