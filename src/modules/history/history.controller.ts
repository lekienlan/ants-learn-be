import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type prisma from 'prisma';
import catchAsync from 'utils/catchAsync';

import { historyService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const categories = await historyService.findMany(req.query);

  res.send(categories);
});

export const findTransHistories = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const history = await historyService.findTransHistories({
      transactionId: req.params.id
    });

    res.send(history);
  }
);

export const create = catchAsync(
  async (
    req: Request<
      {},
      {},
      Prisma.Args<typeof prisma.histories, 'create'>['data']
    >,
    res: Response
  ) => {
    const history = await historyService.create(req.body);

    res.status(StatusCodes.CREATED).send(history);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const history = await historyService.remove({
      id: req.params.id
    });

    res.send(history);
  }
);
