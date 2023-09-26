import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

import type { IUser, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    async validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    delete ret?._id;
  }
});

/**
 * Check if email is taken
 */
userSchema.static(
  'isEmailTaken',
  async function (email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }
);

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
