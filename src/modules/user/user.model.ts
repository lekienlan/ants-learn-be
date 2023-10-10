import paginate from 'middlewares/paginate';
import mongoose, { Schema } from 'mongoose';
import { sortWithIdOnTop } from 'utils';
import validator from 'validator';

import type { IUser, IUserDoc, IUserModel } from './user.interface';

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        delete ret?._id;
        return sortWithIdOnTop(ret);
      }
    }
  }
);

userSchema.plugin(paginate);

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

// Implement the findOrCreate function
userSchema.static('findOrCreate', async function (user: IUser): Promise<IUser> {
  const existingUser = await this.findOne({ email: user.email });

  if (!existingUser) {
    const newUser = await this.create(user);
    return newUser;
  }

  return existingUser;
});

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
