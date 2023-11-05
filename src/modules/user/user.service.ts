import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import prisma from 'prisma';

import { User } from '.';
import type { IUser, IUserDoc } from './user.interface';

export const create = async (userBody: IUser): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already existed');
  }

  return User.create(userBody);
};

export const findByEmail = async (email: string): Promise<IUserDoc | null> => {
  const user = await User.findOne({ email });

  return user;
};

export const findById = async (id: string): Promise<IUserDoc | null> => {
  const user = await User.findOne({ _id: id });
  return user;
};

export const findByAccessToken = async (
  accessToken: string
): Promise<IUserDoc | null> => {
  const payload = tokenService.decode(accessToken);

  const user = await User.findOne({ _id: payload.sub });

  return user;
};

export const findMany = async (
  params: PaginateOptions & Prisma.transactionsWhereInput
) => {
  const users = await paginate<Prisma.transactionsWhereInput>(
    prisma.users,
    params
  );

  return users;
};
