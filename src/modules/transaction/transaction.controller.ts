import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { historyService } from 'modules/history';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import type prisma from 'prisma';
import catchAsync from 'utils/catchAsync';

import { transactionService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const accessToken = tokenService.getAccessTokenFromRequest(req);

  const user = await userService.findByAccessToken(accessToken);

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const transactions = await transactionService.findMany(
    {
      user_id: user.id,
      ...req.query
    },
    { user: true }
  );

  res.send(transactions);
});
export const subtractTransactionTypes = catchAsync(
  async (req: Request, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.findByAccessToken(accessToken);

    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

    const transactions = await transactionService.subtractTransactionTypes({
      user_id: user.id,
      ...req.query
    });

    res.send(transactions);
  }
);

export const findOne = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const transaction = await transactionService.findOne({
      id: req.params.id
    });

    res.send(transaction);
  }
);

export const create = catchAsync(
  async (
    req: Request<
      {},
      {},
      Prisma.Args<typeof prisma.transactions, 'create'>['data']
    >,
    res: Response
  ) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.findByAccessToken(accessToken);

    const { amount, category_id, date, note, period_id, type } = req.body;
    const transaction = await transactionService.create({
      user_id: user?.id || '',
      amount,
      category_id,
      date,
      note,
      period_id,
      type
    });

    res.status(StatusCodes.CREATED).send(transaction);
  }
);

export const update = catchAsync(
  async (
    req: Request<
      { id: string },
      {},
      Prisma.Args<typeof prisma.transactions, 'update'>['data']
    >,
    res: Response
  ) => {
    const { amount, category_id, date, note, period_id, type } = req.body;

    const transaction = await transactionService.update(req.params.id, {
      amount,
      category_id,
      date,
      note,
      period_id,
      type
    });

    await historyService.create({
      transaction_id: transaction.id,
      state: 'modified',
      user_id: transaction.user_id,
      data: {
        amount: transaction.amount,
        category_id: transaction.category_id,
        currency: transaction.currency,
        date: transaction.date,
        note: transaction.note,
        period_id: transaction.period_id
      }
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
      transaction_id: transaction.id,
      state: 'deleted',
      user_id: transaction.user_id,
      data: {
        amount: transaction.amount,
        category_id: transaction.category_id,
        currency: transaction.currency,
        date: transaction.date,
        note: transaction.note,
        period_id: transaction.period_id
      }
    });

    res.send(transaction);
  }
);
