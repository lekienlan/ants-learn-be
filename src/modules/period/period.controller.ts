import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { historyService } from 'modules/history';
import { tokenService } from 'modules/token';
import { transactionService } from 'modules/transaction';
import { userService } from 'modules/user';
import { Error } from 'mongoose';
import type prisma from 'prisma';
import catchAsync from 'utils/catchAsync';

import { periodService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const periods = await periodService.findMany(req.query);

  res.send(periods);
});

export const findFirst = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const period = await periodService.findFirst({
      id: req.params.id
    });

    res.send(period);
  }
);

export const create = catchAsync(
  async (
    req: Request<{}, {}, Prisma.Args<typeof prisma.periods, 'create'>['data']>,
    res: Response
  ) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);
    const user = await userService.findByAccessToken(accessToken);

    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');

    const period = await periodService.create({
      ...req.body,
      status: 'running',
      members: [user?.id, ...((req.body.members || []) as string[])],
      repeat: req.body.repeat ?? true,
      expense: 0
    });

    await transactionService.create({
      period_id: period.id,
      amount: period.budget || 0,
      type: 'budget',
      user_id: user?.id
    });

    res.status(StatusCodes.CREATED).send(period);
  }
);

export const update = catchAsync(
  async (
    req: Request<
      { id: string },
      {},
      Prisma.Args<typeof prisma.periods, 'update'>['data']
    >,
    res: Response
  ) => {
    const period = await periodService.update(req.params.id, req.body);

    if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

    if (period.budget) {
      const currentTransaction = await transactionService.findOne({
        period_id: period?.id,
        type: 'budget'
      });

      if (!currentTransaction) throw new Error('Transaction not found');

      const updatedTransaction = await transactionService.update(
        currentTransaction.id,
        {
          amount: period.budget * -1
        }
      );

      await historyService.create({
        transaction_id: updatedTransaction.id,
        state: 'modified',
        user_id: updatedTransaction.user_id,
        data: {
          amount: updatedTransaction.amount,
          category_id: updatedTransaction.category_id,
          currency: updatedTransaction.currency,
          date: updatedTransaction.date,
          note: updatedTransaction.note,
          period_id: updatedTransaction.period_id
        }
      });
    }

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
