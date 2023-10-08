import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const create = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<IPaginateOptions>(
    req.query,
    PAGINATE_OPTIONS
  );
  const users = await userService.findAll(filter, options);

  res.send(users);
});
