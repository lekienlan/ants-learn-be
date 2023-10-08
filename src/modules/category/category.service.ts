import { snakeCase } from 'lodash';
import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import { removeDiacritics } from 'utils';

import type {
  ICategory,
  ICategoryDoc,
  ICategoryPayload
} from './category.interface';
import Category from './category.model';

export const findAll = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<ICategory>> => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

export const create = async (body: ICategoryPayload): Promise<ICategoryDoc> => {
  const category = await Category.create({
    ...body,
    code: snakeCase(removeDiacritics(body.name))
  });

  if (body.userId) {
    return category.populate('user');
  }

  return category;
};
