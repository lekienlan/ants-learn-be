import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import catchAsync from 'utils/catchAsync';

import { historyService } from '.';
import type { IHistory } from './history.interface';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const categories = await historyService.findMany(filter, options);

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
