import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { generateTokens, verify } from 'modules/token/token.service';
import { userService } from 'modules/user';
import type { IUserDoc, IUserWithTokens } from 'modules/user/user.interface';

/**
 * Login with email
 * @param {string} email
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmail = async (email: string): Promise<IUserDoc> => {
  const user = await userService.findByEmail(email);

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
    const refreshTokenDoc = await verify(refreshToken);

    const user = await userService.findById(refreshTokenDoc.userId);

    if (!user) {
      throw new Error('User not found');
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateTokens(user);
    return { user, tokens };
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      error.message || 'Invalid token'
    );
  }
};
