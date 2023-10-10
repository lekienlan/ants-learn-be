import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';

import type {
  IIncomeDoc,
  IIncomePayload,
  IIncomeUpdatePayload
} from './income.interface';
import Income from './income.model';

export const findMany = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<IIncomeDoc>> => {
  const incomes = await Income.paginate(filter, {
    ...options,
    populate: 'category,user'
  });

  return incomes;
};

export const findOne = async ({
  id
}: {
  id: string;
}): Promise<IIncomeDoc | undefined> => {
  const income = await Income.findById(id);

  if (!income) throw new ApiError(StatusCodes.NOT_FOUND, 'Income not found');

  return income?.populate([
    { path: 'user', model: 'User' },
    { path: 'category', model: 'Category' }
  ]);
};

export const create = async (data: IIncomePayload): Promise<IIncomeDoc> => {
  const income = await Income.create(data);

  return income.populate([
    { path: 'user', model: 'User' },
    { path: 'category', model: 'Category' }
  ]);
};

export const update = async (
  data: IIncomeUpdatePayload
): Promise<IIncomeDoc | null> => {
  const { id, ...payload } = data;

  const income = await Income.findByIdAndUpdate(id, payload, {
    returnDocument: 'after'
  });

  if (!income) throw new ApiError(StatusCodes.NOT_FOUND, 'Income not found');

  return income;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<IIncomeDoc | null> => {
  const income = await Income.findByIdAndRemove(id);

  if (!income) throw new ApiError(StatusCodes.NOT_FOUND, 'Income not found');

  return income;
};
