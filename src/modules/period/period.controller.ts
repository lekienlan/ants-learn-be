import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { periodService } from '.';
import type { IPeriodPayload, IPeriodUpdatePayload } from './period.interface';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const periods = await periodService.findMany(filter, options);

  res.send(periods);
});

export const findOne = catchAsync(
  async (req: Request<{ id: string }, {}, IPeriodPayload>, res: Response) => {
    const transaction = await periodService.findOne({
      id: req.params.id
    });

    res.send(transaction);
  }
);

export const create = catchAsync(
  async (req: Request<{}, {}, IPeriodPayload>, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);
    const user = await userService.findByAccessToken(accessToken);

    if (!user) throw Error('User not found');

    const period = await periodService.create({
      ...req.body,
      members: [user?.id, ...(req.body.members || [])],
      repeat: req.body.repeat ?? true
    });

    res.status(StatusCodes.CREATED).send(period);
  }
);

export const update = catchAsync(
  async (
    req: Request<{ id: string }, {}, IPeriodUpdatePayload>,
    res: Response
  ) => {
    const period = await periodService.update({
      ...req.body,
      id: req.params.id
    });

    res.send(period);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const period = await periodService.remove({
      id: req.params.id
    });

    res.send(period);
  }
);
