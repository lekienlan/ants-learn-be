import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import catchAsync from 'utils/catchAsync';

import { historyService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const accessToken = tokenService.getAccessTokenFromRequest(req);
  const user = await userService.findByAccessToken(accessToken);

  if (!user?.id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'user_id not found');
  }

  const histories = await historyService.findMany({
    ...req.query,
    user_id: user.id
  });

  res.send(histories);
});

export const findTransHistories = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const transactionHistory = await historyService.findTransHistories({
      transaction_id: req.params.id
    });

    if (!transactionHistory.length)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

    res.send(transactionHistory);
  }
);
