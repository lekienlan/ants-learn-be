import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.transactionsWhereInput
) => {
  const transactions = await paginate<Prisma.transactionsWhereInput>(
    prisma.transactions,
    params
  );

  return transactions;
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
