import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';

import type { IHistory, IHistoryDoc } from './history.interface';
import History from './history.model';

export const findMany = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<IHistory>> => {
  const categories = await History.paginate(filter, options);
  return categories;
};
export const findTransHistories = async ({
  transactionId
}: {
  transactionId: string;
}): Promise<IHistoryDoc[]> => {
  const histories = await History.find({ transactionId });

  if (!histories)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return histories;
};

export const create = async (data: IHistory): Promise<IHistoryDoc> => {
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
