import configs from 'configs';
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

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
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
/**
 * Decode token
 * @param {token} string
 * @returns {string | JwtPayload}
 */
export const decodeToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, configs.jwt.accessSecretKey);
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
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

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token: string): Promise<ITokenDoc> => {
  const payload = decodeToken(token);
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

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (
  user: IUserDoc
): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(
    configs.jwt.accessExpirationMinutes,
    'minutes'
  );
  const accessToken = generateToken(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(
    configs.jwt.refreshExpirationDays,
    'days'
  );
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires);

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
