import configs from 'configs';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import ApiError from 'middlewares/error/ApiError';
import type { IUserDoc } from 'modules/user/user.interface';
import type { Moment } from 'moment';
import moment from 'moment';
import type mongoose from 'mongoose';

import type { AccessAndRefreshTokens, ITokenDoc } from './token.interface';
import Token from './token.model';

export const generate = (
  userId: mongoose.Types.ObjectId,
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
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    userId,
    expires: expires.toDate(),
    blacklisted
  });
  return tokenDoc;
};

export const verify = async (token: string): Promise<ITokenDoc> => {
  const payload = decode(token);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'bad user');
  }
  const tokenDoc = await Token.findOne({
    token,
    userId: payload.sub,
    blacklisted: false
  });

  if (!tokenDoc) {
    throw new Error('Invalid token');
  }
  return tokenDoc;
};

export const generateTokens = async (
  user: IUserDoc
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
