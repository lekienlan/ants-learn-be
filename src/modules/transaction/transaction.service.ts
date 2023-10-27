import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult,
  PaginateOptions
} from 'middlewares/paginate/paginate.interface';
import paginatePrisma from 'middlewares/paginate/paginate.prisma';
import prisma from 'prisma';

import type { ITransactionDoc } from './transaction.interface';
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
export const prismaFindMany = async (
  params: PaginateOptions & Prisma.transactionsWhereInput
) => {
  const transactions = await paginatePrisma<Prisma.transactionsWhereInput>(
    prisma.transactions,
    params
  );

  return transactions;
};

export const findOne = async ({
  id
}: {
  id: string;
}): Promise<ITransactionDoc> => {
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
  data: Prisma.Args<typeof prisma.transactions, 'create'>['data']
) => {
  // const transaction = await Transaction.create(data);

  // return transaction.populate([
  //   { path: 'user', model: 'User' },
  //   { path: 'category', model: 'Category' },
  //   { path: 'period', model: 'Period' }
  // ]);

  const transaction = await prisma.transactions.create({
    data,
    include: {
      user: true,
      category: true,
      period: true
    }
  });

  return transaction;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.transactions, 'update'>['data']
) => {
  const transaction = await Transaction.findByIdAndUpdate(id, data, {
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
}): Promise<ITransactionDoc> => {
  const transaction = await Transaction.findByIdAndRemove(id);

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};
