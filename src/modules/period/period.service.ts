import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';

import type {
  IPeriod,
  IPeriodDoc,
  IPeriodPayload,
  IPeriodUpdatePayload
} from './period.interface';
import Period from './period.model';

export const findMany = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<IPeriod>> => {
  const periods = await Period.paginate(filter, {
    ...options,
    populate: 'expenses'
  });
  return periods;
};

export const findOne = async ({
  id
}: {
  id: string;
}): Promise<IPeriodDoc | undefined> => {
  const transaction = await Period.findById(id);

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return transaction?.populate([{ path: 'expenses', model: 'Transaction' }]);
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
