import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { tokenService } from 'modules/token';
import { generateTokens } from 'modules/token/token.service';
import { userService } from 'modules/user';

export const loginWithEmail = async (email: string) => {
  const user = await userService.findByEmail(email);

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email');
  }

  return user;
};

export const refresh = async (refreshToken: string) => {
  try {
    const token = await tokenService.verify(refreshToken);

    const user = await userService.findById(token.userId);

    if (!user) {
      throw new Error('User not found');
    }
    await tokenService.remove(token.id);
    const tokens = await generateTokens(user);
    return { user, tokens };
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      error.message || 'Invalid token'
    );
  }
};
