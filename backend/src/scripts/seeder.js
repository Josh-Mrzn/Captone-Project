// seeder.js
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // ── Check if superadmin already exists ──────────────────
    const existing = await User.findOne({ email: 'dev@agrifair.com' });
    if (existing) {
      console.log('ℹ️  SuperAdmin already exists — skipping seed.');
      process.exit(0);
    }

    // ── Compute next userId safely ──────────────────────────
    // Filter out any documents where userId is not a valid number
    // (happens when older users were registered without auto-increment).
    const allUsers = await User.find({}, 'userId').lean();
    const validIds = allUsers
      .map(u => u.userId)
      .filter(id => typeof id === 'number' && Number.isFinite(id));

    const nextId = validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
    console.log(`🔢 Assigning userId: ${nextId}`);

    // ── Create the superadmin ───────────────────────────────
    // The pre('save') hook on the User model will bcrypt the plain-text
    // password automatically before it hits the database.
    const superAdmin = new User({
      userId:   nextId,
      name:     'SuperAdmin',
      email:    'dev@agrifair.com',
      password: '120903',       // plain text — hashed by pre-save hook
      role:     'superadmin',
      status:   'active',
    });

    await superAdmin.save();
    console.log(`🎉 SuperAdmin created successfully!`);
    console.log(`   Email    : dev@agrifair.com`);
    console.log(`   Password : 120903`);
    console.log(`   userId   : ${nextId}`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding SuperAdmin:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
