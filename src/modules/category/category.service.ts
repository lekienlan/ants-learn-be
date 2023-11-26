import type { categories, Prisma } from '@prisma/client';
import paginate from 'middlewares/paginate';
import type {
  PaginateOptions,
  QueryResults
} from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.categoriesWhereInput,
  include?: Prisma.categoriesInclude
): Promise<QueryResults<categories>> => {
  const list = await paginate<categories>(prisma.categories, params, include);
  return list;
};

export const create = async (
  data: Prisma.Args<typeof prisma.categories, 'create'>['data']
): Promise<categories> => {
  const category = await prisma.categories.create({
    data,
    include: { user: true }
  });

  return category;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.categories, 'update'>['data']
): Promise<categories> => {
  const category = await prisma.categories.update({
    where: { id },
    data
  });

  return category;
};

export const remove = async ({ id }: { id: string }): Promise<categories> => {
  const category = await prisma.categories.delete({ where: { id } });

  return category;
};
