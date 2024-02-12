import type { histories, Prisma } from '@prisma/client';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.historiesWhereInput
) => {
  const list = await paginate<histories>(prisma.histories, params);
  return list;
};
export const findTransHistories = async ({
  transaction_id
}: {
  transaction_id: string;
}) => {
  const histories = await prisma.histories.findMany({
    where: { transaction_id },
    orderBy: { created_at: 'desc' }
  });

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

  return history;
};
