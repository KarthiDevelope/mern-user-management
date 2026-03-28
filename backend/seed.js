require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Clear existing users (optional)
  await User.deleteMany({});
  console.log('🗑️  Existing users cleared');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
  });

  // Create sample regular users
  const users = await User.create([
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'user1234', role: 'user', phone: '9876543211' },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'user1234', role: 'user', phone: '9876543212' },
    { name: 'Charlie Brown', email: 'charlie@example.com', password: 'user1234', role: 'user' },
    { name: 'Diana Prince', email: 'diana@example.com', password: 'user1234', role: 'user' },
    { name: 'Eve Davis', email: 'eve@example.com', password: 'user1234', role: 'admin' },
  ]);

  console.log('✅ Seed data created successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('----------------------------');
  console.log('Admin → admin@example.com / admin123');
  console.log('User  → alice@example.com  / user1234');
  console.log('----------------------------\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
