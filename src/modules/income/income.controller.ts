import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { incomeService } from '.';
import type { IIncomePayload, IIncomeUpdatePayload } from './income.interface';

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

  const incomes = await incomeService.findMany(filter, options);

  const totalAmount = incomes.results.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);

  res.send({ ...incomes, totalAmount });
});

export const findOne = catchAsync(
  async (req: Request<{ id: string }, {}, IIncomePayload>, res: Response) => {
    const income = await incomeService.findOne({
      id: req.params.id
    });

    res.send(income);
  }
);

export const create = catchAsync(
  async (req: Request<{}, {}, IIncomePayload>, res: Response) => {
    const accessToken = tokenService.getAccessTokenFromRequest(req);

    const user = await userService.findByAccessToken(accessToken);

    const { amount, categoryId, date, note } = req.body;
    const income = await incomeService.create({
      userId: user?.id,
      amount,
      categoryId,
      date,
      note
    });

    res.status(StatusCodes.CREATED).send(income);
  }
);

export const update = catchAsync(
  async (
    req: Request<{ id: string }, {}, IIncomeUpdatePayload>,
    res: Response
  ) => {
    const { amount, categoryId, date, note } = req.body;

    const income = await incomeService.update({
      id: req.params.id,
      amount,
      categoryId,
      date,
      note
    });

    res.send(income);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const income = await incomeService.remove({
      id: req.params.id
    });

    res.send(income);
  }
);
