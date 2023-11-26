import type { Prisma, transactions } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import { historyService } from 'modules/history';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.transactionsWhereInput,
  include?: Prisma.transactionsInclude
) => {
  const list = await paginate<transactions>(
    prisma.transactions,
    params,
    include
  );

  return list;
};

export const findOne = async (where: Prisma.transactionsWhereInput) => {
  const transaction = await prisma.transactions.findFirst({ where });

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};

export const create = async (
  data: Prisma.Args<typeof prisma.transactions, 'create'>['data']
) => {
  const transaction = await prisma.transactions.create({
    data,
    include: {
      user: true,
      category: true,
      period: true
    }
  });

  await historyService.create({
    transactionId: transaction.id,
    state: 'original',
    userId: transaction.userId,
    data: {
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      currency: transaction.currency,
      date: transaction.date,
      note: transaction.note,
      periodId: transaction.periodId
    }
  });

  // const expense = await prisma.transactions.aggregate({
  //   where: { periodId: data.periodId },
  //   _sum: {
  //     amount: true
  //   }
  // });

  // periodService.update(data.periodId || '', {
  //   expense: expense._sum.amount || 0
  // });

  return transaction;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.transactions, 'update'>['data']
) => {
  const transaction = await prisma.transactions.update({
    where: { id },
    data
  });

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};

export const remove = async ({ id }: { id: string }) => {
  const transaction = await prisma.transactions.delete({ where: { id } });

  if (!transaction)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return transaction;
};
