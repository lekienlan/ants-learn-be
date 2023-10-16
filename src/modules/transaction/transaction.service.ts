import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';

import type {
  ITransactionDoc,
  ITransactionPayload,
  ITransactionUpdatePayload
} from './transaction.interface';
import Transaction from './transaction.model';

export const findMany = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<ITransactionDoc>> => {
  const transactions = await Transaction.paginate(filter, {
    ...options,
    populate: 'category,user,period'
  });

  return transactions;
};

export const findOne = async ({
  id
}: {
  id: string;
}): Promise<ITransactionDoc | undefined> => {
  const transaction = await Transaction.findById(id);

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction?.populate([
    { path: 'user', model: 'User' },
    { path: 'category', model: 'Category' },
    { path: 'period', model: 'Period' }
  ]);
};

export const create = async (
  data: ITransactionPayload
): Promise<ITransactionDoc> => {
  const transaction = await Transaction.create(data);

  return transaction.populate([
    { path: 'user', model: 'User' },
    { path: 'category', model: 'Category' },
    { path: 'period', model: 'Period' }
  ]);
};

export const update = async (
  data: ITransactionUpdatePayload
): Promise<ITransactionDoc | null> => {
  const { id, ...payload } = data;

  const transaction = await Transaction.findByIdAndUpdate(id, payload, {
    returnDocument: 'after'
  });

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<ITransactionDoc | null> => {
  const transaction = await Transaction.findByIdAndRemove(id);

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};
