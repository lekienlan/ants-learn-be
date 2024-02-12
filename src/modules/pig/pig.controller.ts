import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import type prisma from 'prisma';
import catchAsync from 'utils/catchAsync';

import { pigService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.findByAccessToken(
    tokenService.getAccessTokenFromRequest(req)
  );

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const piggies = await pigService.findMany(
    { ...req.query, user_id: user.id },
    {
      periods: true
    }
  );

  res.send(piggies);
});

export const findFirst = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const pig = await pigService.findFirst({
      id: req.params.id
    });

    res.send(pig);
  }
);

export const create = catchAsync(
  async (
    req: Request<{}, {}, Prisma.pigsUncheckedCreateInput>,
    res: Response
  ) => {
    const user = await userService.findByAccessToken(
      tokenService.getAccessTokenFromRequest(req)
    );

    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

    const pig = await pigService.create({ ...req.body, user_id: user?.id });

    res.status(StatusCodes.CREATED).send(pig);
  }
);

export const update = catchAsync(
  async (
    req: Request<
      { id: string },
      {},
      Prisma.Args<typeof prisma.pigs, 'update'>['data']
    >,
    res: Response
  ) => {
    const pig = await pigService.update(req.params.id, req.body);

    res.send(pig);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const pig = await pigService.remove({
      id: req.params.id
    });

    res.send(pig);
  }
);
