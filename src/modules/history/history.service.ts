import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

import type { IHistoryDoc } from './history.interface';
import History from './history.model';

export const findMany = async (
  params: PaginateOptions & Prisma.historiesWhereInput
) => {
  const histories = await paginate<Prisma.historiesWhereInput>(
    prisma.histories,
    params
  );
  return histories;
};
export const findTransHistories = async ({
  transactionId
}: {
  transactionId: string;
}): Promise<IHistoryDoc[]> => {
  const histories = await History.find({ transactionId }).sort('-createdAt');

  if (!histories)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return histories;
};

export const create = async (
  data: Prisma.Args<typeof prisma.histories, 'update'>['data']
) => {
  const history = await History.create(data);

  return history;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<IHistoryDoc | null> => {
  const history = await History.findByIdAndRemove(id);

  if (!history) throw new ApiError(StatusCodes.NOT_FOUND, 'History not found');

  return history;
};
