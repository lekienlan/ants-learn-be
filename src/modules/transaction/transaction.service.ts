import type { Prisma, transactions } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import { historyService } from 'modules/history';
import { periodService } from 'modules/period';
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

  const total = await prisma.transactions.aggregate({
    _sum: {
      amount: true
    },
    where: params
  });

  return { ...list, totalAmount: total._sum.amount };
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

  if (data?.period_id && data?.type === 'expense') {
    const currentPeriod = await periodService?.findFirst({
      id: data?.period_id
    });
    await periodService.update(data?.period_id, {
      expense: (currentPeriod?.expense || 0) + (data?.amount || 0)
    });
  }

  historyService.create({
    transaction_id: transaction.id,
    state: 'original',
    user_id: transaction.user_id,
    data: {
      amount: transaction.amount,
      category_id: transaction.category_id,
      currency: transaction.currency,
      date: transaction.date,
      note: transaction.note,
      period_id: transaction.period_id
    }
  });

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
