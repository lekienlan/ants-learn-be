import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from 'utils/catchAsync';

import { historyService } from '.';
import type { IHistory } from './history.interface';

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
  async (req: Request<{}, {}, IHistory>, res: Response) => {
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
