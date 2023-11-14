import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';

const catchAsync =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    await Promise.resolve(fn(req, res, next)).catch((err) => {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    });
  };

export default catchAsync;
