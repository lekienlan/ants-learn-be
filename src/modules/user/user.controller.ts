import type { Request, Response } from 'express';
import { tokenService } from 'modules/token';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.findMany(req.query);

  res.send(users);
});

export const findOne = catchAsync(async (req: Request, res: Response) => {
  const accessToken = tokenService.getAccessTokenFromRequest(req);
  const user = await userService.findByAccessToken(accessToken);

  res.send(user);
});
