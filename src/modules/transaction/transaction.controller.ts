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
      userId: user.id,
      ...req.query
    },
    { user: true }
  );

  res.send(transactions);
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

    const { amount, categoryId, date, note, periodId, type } = req.body;
    const transaction = await transactionService.create({
      userId: user?.id || '',
      amount,
      categoryId,
      date,
      note,
      periodId,
      type: type || (amount > 0 ? 'income' : 'expense')
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
    const { amount, categoryId, date, note, periodId, type } = req.body;

    const transaction = await transactionService.update(req.params.id, {
      amount,
      categoryId,
      date,
      note,
      periodId,
      type
    });

    await historyService.create({
      transactionId: transaction.id,
      state: 'modified',
      userId: transaction.userId,
      data: {
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        currency: transaction.currency,
        date: transaction.date,
        note: transaction.note,
        periodId: transaction.periodId
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
      transactionId: transaction.id,
      state: 'deleted',
      userId: transaction.userId,
      data: {
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        currency: transaction.currency,
        date: transaction.date,
        note: transaction.note,
        periodId: transaction.periodId
      }
    });

    res.send(transaction);
  }
);
