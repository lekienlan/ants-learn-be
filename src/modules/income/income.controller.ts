import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { incomeService } from '.';
import type { IIncomePayload } from './income.interface';

export const getUserIncomes = catchAsync(
  async (req: Request, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.getUserByAccessToken(accessToken);
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

    const incomes = await incomeService.queryIncomes(filter, options);

    const totalAmount = incomes.results.reduce((prev, current) => {
      return prev + current.amount;
    }, 0);

    res.send({ ...incomes, totalAmount });
  }
);

export const addIncome = catchAsync(
  async (req: Request<{}, {}, IIncomePayload>, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.getUserByAccessToken(accessToken);

    const { amount, categoryId, date, note } = req.body;
    const income = await incomeService.addIncome({
      userId: user?.id,
      amount,
      categoryId,
      date,
      note
    });

    res.status(StatusCodes.CREATED).send(income);
  }
);
