import type { Request, Response } from 'express';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.findMany(req.query);

  res.send(users);
});
