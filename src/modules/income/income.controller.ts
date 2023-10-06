import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { incomeService } from '.';
import type { IIncomePayload } from './income.interface';

export const getUserIncomes = catchAsync(
  async (req: Request, res: Response) => {
    const accessToken =
      req.headers?.authorization?.replace('Bearer ', '') || '';

    const user = await userService.getUserByAccessToken(accessToken);
    const filter = omit(
      {
        ...req.query,
        ...req.body,
        userId: user?.id
      },
      PAGINATE_OPTIONS
    );
    const options: IPaginateOptions = pick<Record<string, any>>(
      req.query,
      PAGINATE_OPTIONS
    );

    const incomes = await incomeService.queryIncomes(filter, options);

    res.send(incomes);
  }
);

export const getUserTotalIncome = catchAsync(
  async (req: Request, res: Response) => {
    const accessToken =
      req.headers?.authorization?.replace('Bearer ', '') || '';

    const user = await userService.getUserByAccessToken(accessToken);

    const filter = omit({ ...req.query, userId: user?.id }, PAGINATE_OPTIONS);
    const options: IPaginateOptions = pick<IPaginateOptions>(
      req.query,
      PAGINATE_OPTIONS
    );

    const total = await incomeService.queryIncomesTotalAmount(filter, options);

    res.send(total);
  }
);

export const addIncome = catchAsync(
  async (req: Request<{}, {}, IIncomePayload>, res: Response) => {
    const accessToken =
      req.headers?.authorization?.replace('Bearer ', '') || '';

    const user = await userService.getUserByAccessToken(accessToken);

    const { amount, categoryId, date } = req.body;
    const income = await incomeService.addIncome({
      userId: user?.id,
      amount,
      categoryId,
      date
    });

    res.status(StatusCodes.CREATED).send(income);
  }
);
