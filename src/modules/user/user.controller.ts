import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);

  // res.status(StatusCodes.BAD_REQUEST).send(err);
});
