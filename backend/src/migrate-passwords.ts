
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user';

async function migratePasswords() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/portal');
    console.log('Connected to Portal database');

    const users = await User.find().select('+password').lean();
    let migratedCount = 0;

    for (const user of users) {
      
      const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(user.password);

      if (!isBcryptHash) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await User.collection.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );

        migratedCount++;
        console.log(`Migrated password for user: ${user.userId}`);
      }
    }

    console.log(`Migration complete. Passwords migrated: ${migratedCount}`);
  } catch (error) {
    console.error('Password migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migratePasswords();
