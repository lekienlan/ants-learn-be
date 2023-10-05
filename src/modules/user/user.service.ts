import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type { IPaginateOptions, IPaginateResult } from 'middlewares/paginate';

import { User } from '.';
import type { IUser, IUserDoc } from './user.interface';

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

/**
 * Get user by google id
 * @param {string} email
 * @returns {Promise<IUserDoc | undefined>}
 */
export const getUserByEmail = async (
  email: string
): Promise<IUserDoc | undefined> => {
  const user = await User.findOne({ email });

  return user?.toJSON();
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IUserDoc | undefined>}
 */
export const getUserById = async (
  id: string
): Promise<IUserDoc | undefined> => {
  const user = await User.findOne({ _id: id });
  return user?.toJSON();
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<IPaginateResult>}
 */
export const queryUsers = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult> => {
  console.log(options);
  const users = await User.paginate(filter, options);
  return users;
};
