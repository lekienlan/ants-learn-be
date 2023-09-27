import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ApiError(StatusCodes.BAD_REQUEST, err.message));
        return;
      }

      next(err);
    });
  };

export default catchAsync;
