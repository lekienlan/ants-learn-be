import type { Model } from 'mongoose';
import type mongoose from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  googleId?: string;
  password?: string;
  phone?: string;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  findOrCreate(user: IUser): Promise<void>;
}
