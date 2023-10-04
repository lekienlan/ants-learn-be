import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import ApiError from 'middlewares/error/ApiError';
import { User } from 'modules/user';
import passport from 'passport';
import catchAsync from 'utils/catchAsync';

const secretKey = process.env.SECRET_KEY || '';

export const loginWithGoogle = catchAsync(
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

export const callbackGoogle = catchAsync(
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false
  })
);

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ googleId: req?.user?.id });

    // Generate a JWT token upon successful Google login
    if (!user?.email) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated'));
    }
    const token = jwt.sign(user?.toJSON()!, secretKey, {
      expiresIn: '2min'
    });

    // // Send the token as a response
    res.status(StatusCodes.ACCEPTED).send({ token });
  }
);

export const loginSuccess = catchAsync(async (_req: Request, res: Response) => {
  res.status(StatusCodes.ACCEPTED).send({ message: 'hello' });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  // req.logout
  req.session.destroy(() => {
    // accounts.google.com/logout
    res.redirect('/');
  });
});
