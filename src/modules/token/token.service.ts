import type { users } from '@prisma/client';
import configs from 'configs';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import ApiError from 'middlewares/error/ApiError';
import type { Moment } from 'moment';
import moment from 'moment';
import prisma from 'prisma';

import type { AccessAndRefreshTokens } from './token.interface';

export const generate = (
  userId: string,
  expires: Moment,
  secret: string = configs.jwt.accessSecretKey
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, secret);
};

export const decode = (token: string): string | JwtPayload => {
  return jwt.verify(token, configs.jwt.accessSecretKey);
};

export const create = async (
  token: string,
  userId: string,
  expires: Moment,
  blacklisted: boolean = false
) => {
  const tokenResp = await prisma.tokens.create({
    data: {
      token,
      userId,
      expires: expires.toDate(),
      blacklisted
    }
  });
  return tokenResp;
};

export const verify = async (token: string) => {
  const payload = decode(token);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const tokenResult = await prisma.tokens.findFirst({
    where: {
      token,
      userId: payload.sub,
      blacklisted: false
    }
  });

  if (!tokenResult) {
    throw new Error('Invalid token');
  }
  return tokenResult;
};

export const generateTokens = async (
  user: users
): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(
    configs.jwt.accessExpirationMinutes,
    'minutes'
  );
  const accessToken = generate(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(
    configs.jwt.refreshExpirationDays,
    'days'
  );
  const refreshToken = generate(user.id, refreshTokenExpires);
  await create(refreshToken, user.id, refreshTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

export const getAccessTokenFromRequest = (header: Request) => {
  const accessToken =
    header.headers?.authorization?.replace('Bearer ', '') || '';

  return accessToken;
};

export const remove = async (id: string) => {
  await prisma.tokens.delete({ where: { id } });
};
