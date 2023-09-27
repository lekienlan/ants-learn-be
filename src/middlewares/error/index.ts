import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from 'middlewares/logger';

import type ApiError from './ApiError';

export const errorHandler = (
  err: ApiError,
  _: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;

  logger.debug(err.statusCode);

  if (!err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = message || 'Internal Server Error';
  }

  const response = {
    code: statusCode,
    message
  };

  res.status(statusCode).send(response);
};
