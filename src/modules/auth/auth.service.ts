import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { generateAuthTokens, verifyToken } from 'modules/token/token.service';
import { userService } from 'modules/user';
import type { IUserDoc, IUserWithTokens } from 'modules/user/user.interface';

/**
 * Login with email
 * @param {string} email
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmail = async (email: string): Promise<IUserDoc> => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email');
  }

  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (
  refreshToken: string
): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken);

    const user = await userService.getUserById(refreshTokenDoc.userId);

    if (!user) {
      throw new Error('User not found');
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      error.message || 'Invalid token'
    );
  }
};
