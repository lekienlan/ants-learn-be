import configs from 'configs';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import ApiError from 'middlewares/error/ApiError';

const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  if (!token) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'A token is required for authentication'
      )
    );
  }
  try {
    jwt.verify(token.replace('Bearer ', ''), configs.jwt.accessSecretKey);
  } catch (err: any) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, err?.message || 'Invalid token')
    );
  }
  return next();
};

export default authMiddleware;
