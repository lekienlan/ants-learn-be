import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { historyService } from 'modules/history';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { transactionService } from '.';
import type {
  ITransactionPayload,
  ITransactionUpdatePayload
} from './transaction.interface';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const accessToken = tokenService.getAccessTokenFromRequest(req);

  const user = await userService.findByAccessToken(accessToken);
  const filter = omit(
    {
      ...req.query,
      userId: user?.id
    },
    PAGINATE_OPTIONS
  );
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const transactions = await transactionService.findMany(filter, options);

  const totalAmount = transactions.results.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);

  res.send({ ...transactions, totalAmount });
});

export const findOne = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const transaction = await transactionService.findOne({
      id: req.params.id
    });

    res.send(transaction);
  }
);

export const create = catchAsync(
  async (req: Request<{}, {}, ITransactionPayload>, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.findByAccessToken(accessToken);

    const { amount, categoryId, date, note, periodId } = req.body;
    const transaction = await transactionService.create({
      userId: user?.id,
      amount,
      categoryId,
      date,
      note,
      periodId
    });
    await historyService.create({
      transactionId: transaction.id,
      data: transaction,
      state: 'original'
    });

    res.status(StatusCodes.CREATED).send(transaction);
  }
);

export const update = catchAsync(
  async (
    req: Request<{ id: string }, {}, ITransactionUpdatePayload>,
    res: Response
  ) => {
    const { amount, categoryId, date, note } = req.body;

    const transaction = await transactionService.update({
      id: req.params.id,
      amount,
      categoryId,
      date,
      note
    });

    await historyService.create({
      transactionId: transaction.id,
      data: transaction,
      state: 'modified'
    });

    res.send(transaction);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const transaction = await transactionService.remove({
      id: req.params.id
    });

    await historyService.create({
      transactionId: transaction.id,
      data: transaction,
      state: 'deleted'
    });

    res.send(transaction);
  }
);
