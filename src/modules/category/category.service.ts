import { StatusCodes } from 'http-status-codes';
import { snakeCase } from 'lodash';
import ApiError from 'middlewares/error/ApiError';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import { removeDiacritics } from 'utils';

import type {
  ICategory,
  ICategoryDoc,
  ICategoryPayload,
  ICategoryUpdatePayload
} from './category.interface';
import Category from './category.model';

export const findMany = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<ICategory>> => {
  const categories = await Category.paginate(filter, options);
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
