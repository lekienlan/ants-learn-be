import type { IPaginateResult } from 'middlewares/paginate';
import type { AccessAndRefreshTokens } from 'modules/token/token.interface';
import type { Document, Model } from 'mongoose';
import type mongoose from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
export interface IUserDoc extends IUser, Document {}
export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  findOrCreate(user: IUser): Promise<IUserDoc>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<IPaginateResult>;
}

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
