import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.historiesWhereInput
) => {
  const histories = await paginate<Prisma.historiesWhereInput>(
    prisma.histories,
    params
  );
  return histories;
};
export const findTransHistories = async ({
  transactionId
}: {
  transactionId: string;
}) => {
  const histories = await prisma.histories.findFirst({
    where: { transactionId },
    orderBy: { createdAt: 'desc' }
  });

  if (!histories)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Transaction not found');

  return histories;
};

export const create = async (
  data: Prisma.Args<typeof prisma.histories, 'create'>['data']
) => {
  const history = await prisma.histories.create({ data });

  return history;
};

export const remove = async ({ id }: { id: string }) => {
  const history = await prisma.histories.delete({ where: { id } });

  if (!history) throw new ApiError(StatusCodes.NOT_FOUND, 'History not found');

  return history;
};
