import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { historyService } from 'modules/history';
import { tokenService } from 'modules/token';
import { transactionService } from 'modules/transaction';
import Transaction from 'modules/transaction/transaction.model';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { periodService } from '.';
import type { IPeriodPayload, IPeriodUpdatePayload } from './period.interface';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const periods = await periodService.findMany(filter, options);

  res.send(periods);
});

export const findOne = catchAsync(
  async (req: Request<{ id: string }, {}, IPeriodPayload>, res: Response) => {
    const period = await periodService.findOne({
      id: req.params.id
    });

    res.send(period);
  }
);

export const create = catchAsync(
  async (req: Request<{}, {}, IPeriodPayload>, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);
    const user = await userService.findByAccessToken(accessToken);

    if (!user) throw Error('User not found');

    const period = await periodService.create({
      ...req.body,
      members: [user?.id, ...(req.body.members || [])],
      repeat: req.body.repeat ?? true,
      expense: 0
    });

    const transaction = await transactionService.create({
      periodId: period.id,
      amount: (period.budget || 0) * -1,
      type: 'budget',
      userId: user?.id
    });

    await historyService.create({
      transactionId: transaction.id,
      data: {
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        currency: transaction.currency,
        date: transaction.date,
        note: transaction.note,
        periodId: transaction.periodId,
        userId: transaction.userId
      },
      state: 'original'
    });

    res.status(StatusCodes.CREATED).send(period);
  }
);

export const update = catchAsync(
  async (
    req: Request<{ id: string }, {}, IPeriodUpdatePayload>,
    res: Response
  ) => {
    const period = await periodService.update({
      ...req.body,
      id: req.params.id
    });

    if (req.body.budget) {
      const currentTransaction = await Transaction.findOne({
        periodId: period?.id,
        type: 'budget'
      });

      if (!currentTransaction) throw Error('Transaction not found');

      const updatedTransaction = await transactionService.update(
        currentTransaction._id,
        {
          amount: (req.body.budget || 0) * -1
        }
      );

      await historyService.create({
        transactionId: updatedTransaction.id,
        data: {
          amount: updatedTransaction.amount,
          categoryId: updatedTransaction.categoryId,
          currency: updatedTransaction.currency,
          date: updatedTransaction.date,
          note: updatedTransaction.note,
          periodId: updatedTransaction.periodId,
          userId: updatedTransaction.userId
        },
        state: 'modified'
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
