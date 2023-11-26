import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
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

export const findOne = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const period = await periodService.findOne({
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

    if (!user) throw new Error('User not found');

    const period = await periodService.create({
      ...req.body,
      members: [user?.id, ...((req.body.members || []) as string[])],
      repeat: req.body.repeat ?? true,
      expense: 0
    });

    await transactionService.create({
      periodId: period.id,
      amount: (period.budget || 0) * -1,
      type: 'budget',
      userId: user?.id
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

    if (period.budget) {
      const currentTransaction = await transactionService.findOne({
        periodId: period?.id,
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
        transactionId: updatedTransaction.id,
        state: 'modified',
        userId: updatedTransaction.userId,
        data: {
          amount: updatedTransaction.amount,
          categoryId: updatedTransaction.categoryId,
          currency: updatedTransaction.currency,
          date: updatedTransaction.date,
          note: updatedTransaction.note,
          periodId: updatedTransaction.periodId
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
