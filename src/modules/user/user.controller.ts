import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const create = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.findMany(req.query);

  res.send(users);
});
