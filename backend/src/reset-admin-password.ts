import mongoose from 'mongoose';
import User from './models/user';

async function resetAdminPassword() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/portal');

    const admin = await User.findOne({
      userId: 'admin001',
      role: 'Admin'
    });

    if (!admin) {
      console.log('Admin account not found');
      return;
    }

    admin.password = 'admin123';
    await admin.save();

    console.log('Admin password reset successfully');
  } catch (error) {
    console.error('Password reset failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdminPassword();
