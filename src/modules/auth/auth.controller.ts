import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { tokenService } from 'modules/token';
import passport from 'passport';
import catchAsync from 'utils/catchAsync';

import { authService } from '.';

export const loginWithGoogle = catchAsync(
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

export const callbackGoogle = catchAsync(
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false
  })
);

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.loginWithEmail(req?.user?.email || '');
  const tokens = await tokenService.generateTokens(user);
  res.status(StatusCodes.ACCEPTED).send({ user, tokens });
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refresh(req.body.refreshToken);
  res.send({ ...userWithTokens });
});
