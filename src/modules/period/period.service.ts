import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

import type {
  IPeriodDoc,
  IPeriodPayload,
  IPeriodUpdatePayload
} from './period.interface';
import Period from './period.model';

export const findMany = async (
  params: PaginateOptions & Prisma.periodsWhereInput
) => {
  const periods = await paginate(prisma.periods, params);
  return periods;
};

export const findOne = async ({
  id
}: {
  id: string;
}): Promise<IPeriodDoc | undefined> => {
  const period = await Period.findById(id);

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};

export const create = async (data: IPeriodPayload): Promise<IPeriodDoc> => {
  const period = await Period.create(data);

  return period;
};

export const update = async (
  data: IPeriodUpdatePayload
): Promise<IPeriodDoc | null> => {
  const { id, ...payload } = data;

  const period = await Period.findByIdAndUpdate(id, payload, {
    returnDocument: 'after'
  });

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<IPeriodDoc | null> => {
  const period = await Period.findByIdAndRemove(id);

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};
