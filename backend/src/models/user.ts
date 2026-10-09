
import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  userId: string;
  password: string;
  role: 'General User' | 'Admin';
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['General User', 'Admin']
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const User: Model<IUser> = mongoose.model<IUser>(
  'User',
  userSchema
);

export default User;
