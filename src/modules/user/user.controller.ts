import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import catchAsync from 'utils/catchAsync';

import { userService } from '.';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);

  // res.status(StatusCodes.BAD_REQUEST).send(err);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<IPaginateOptions>(
    req.query,
    PAGINATE_OPTIONS
  );
  const users = await userService.queryUsers(filter, options);

  res.send(users);
});
