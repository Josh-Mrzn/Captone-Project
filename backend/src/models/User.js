// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  }
}, { 
  timestamps: true 
});

// Password hashing middleware - Use async/await (NO next())
userSchema.pre('save', async function () {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

export default User;