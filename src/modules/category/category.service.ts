import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { snakeCase } from 'lodash';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
import { removeDiacritics } from 'utils';

import type {
  ICategoryDoc,
  ICategoryPayload,
  ICategoryUpdatePayload
} from './category.interface';
import Category from './category.model';

export const findMany = async (
  params: PaginateOptions & Prisma.categoriesWhereInput
) => {
  const categories = await paginate<Prisma.categoriesWhereInput>(
    prisma.categories,
    params
  );
  return categories;
};

export const create = async (data: ICategoryPayload): Promise<ICategoryDoc> => {
  const category = await Category.create({
    ...data,
    code: snakeCase(removeDiacritics(data.name))
  });

  if (data.userId) {
    return category.populate('user');
  }

  return category;
};

export const update = async (
  data: ICategoryUpdatePayload
): Promise<ICategoryDoc | null> => {
  const { id, ...payload } = data;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      ...payload,
      ...(data?.name
        ? { code: snakeCase(removeDiacritics(data.name)) }
        : undefined)
    },
    {
      returnDocument: 'after'
    }
  );

  if (!category)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');

  return category;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<ICategoryDoc | null> => {
  const category = await Category.findByIdAndRemove(id);

  if (!category)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');

  return category;
};
