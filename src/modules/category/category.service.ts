import type { categories, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { snakeCase } from 'lodash';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
import { removeDiacritics } from 'utils';

export const findMany = async (
  params: PaginateOptions & Prisma.categoriesWhereInput,
  include?: Prisma.categoriesInclude
) => {
  const list = await paginate<categories>(prisma.categories, params, include);
  return list;
};

export const create = async (
  data: Omit<Prisma.Args<typeof prisma.categories, 'create'>['data'], 'code'>
) => {
  const category = await prisma.categories.create({
    data: {
      ...data,
      code: snakeCase(removeDiacritics(data.name)) || ''
    }
  });

  return category;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.categories, 'update'>['data']
) => {
  const category = await prisma.categories.update({
    where: { id },
    data
  });

  if (!category)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');

  return category;
};

export const remove = async ({ id }: { id: string }) => {
  const category = await prisma.categories.delete({ where: { id } });

  if (!category)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');

  return category;
};
