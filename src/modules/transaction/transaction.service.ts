import type { Prisma, transactions } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import { paginateFilterSql } from 'middlewares/paginate/paginate';
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

  return { ...list, total_amount: total?._sum?.amount };
};

export const subtractTransactionTypes = async (
  params: PaginateOptions & PaginateOptions & Prisma.transactionsWhereInput
) => {
  const rawQuery = `
  SELECT SUM(total_amount) AS total_amount
FROM (
SELECT *,
  CASE
    WHEN type = '${(params?.type as string)?.split(',')?.[1]}' THEN -amount
    ELSE amount
  END AS total_amount
FROM transactions
WHERE ${paginateFilterSql(params)}
) AS subquery;
`;

  const total =
    await prisma.$queryRawUnsafe<{ total_amount: number }[]>(rawQuery);

  return { total_amount: Number(total?.[0]?.total_amount?.toString()) };
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
