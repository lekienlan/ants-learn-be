import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { pigService } from '.';
import type { IPigPayload, IPigUpdatePayload } from './pig.interface';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const piggies = await pigService.findMany(filter, options);

  res.send(piggies);
});

export const create = catchAsync(
  async (req: Request<{}, {}, IPigPayload>, res: Response) => {
    const { name, type, style } = req.body;

    const user = await userService.findByAccessToken(
      tokenService.getAccessTokenFromRequest(req)
    );
    const pig = await pigService.create({
      name,
      type,
      style,
      userId: user?.id
    });

    res.status(StatusCodes.CREATED).send(pig);
  }
);

export const update = catchAsync(
  async (
    req: Request<{ id: string }, {}, IPigUpdatePayload>,
    res: Response
  ) => {
    const { name, type, style } = req.body;

    const pig = await pigService.update({
      id: req.params.id,
      name,
      type,
      style
    });

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
