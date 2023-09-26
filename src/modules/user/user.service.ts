import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';

import { User } from '.';
import type { IUser } from './user.interface';

/**
 * Create a user
 * @param {IUser} userBody
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: IUser): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already existed');
  }

  return User.create(userBody);
};
