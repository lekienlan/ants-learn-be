import { omit } from 'lodash';
import { convertStringToType } from 'utils';

import type { PaginateOptions, QueryResults } from './paginate.interface';

export const paginateFilter = (filter: Record<string, any>) => {
  const formattedFilter = omit(filter, ['limit', 'sortBy', 'page']);
  Object.keys(formattedFilter).forEach((key) => {
    // if filter is an array
    if (Array.isArray(formattedFilter[key])) {
      const [gte, lte] = formattedFilter[key];
      if (gte || lte) {
        formattedFilter[key] = {
          ...(gte ? { gte: convertStringToType(gte) } : {}),
          ...(lte ? { lte: convertStringToType(lte) } : {})
        };
      } else {
        delete formattedFilter[key];
      }
    } else {
      formattedFilter[key] = { in: formattedFilter[key].split(',') };
    }
  });

  return formattedFilter;
};

const paginate = async <T = Record<string, any>>(
  model: any,
  params: T & PaginateOptions
): Promise<QueryResults<T>> => {
  const { sortBy = 'updatedAt', limit, page, ...query } = params;

  const _limit = limit ? parseInt(limit, 10) : 10;
  const _page = page ? parseInt(page, 10) : 1;
  const skip = (_page - 1) * (_limit || 0);

  const orderBy: { field: string; direction: 'asc' | 'desc' } =
    sortBy.startsWith('-')
      ? { field: sortBy.substring(1), direction: 'desc' }
      : { field: sortBy, direction: 'asc' };

  const totalResults = await model.count({ where: paginateFilter(query) });
  const results = await model.findMany({
    where: paginateFilter(query),
    skip,
    take: _limit,
    orderBy: {
      [orderBy.field]: orderBy.direction
    }
  });

  const totalPages = _limit ? Math.ceil(totalResults / _limit) : 1;

  return {
    results,
    page: _page,
    limit: _limit,
    totalPages,
    totalResults
  };
};

export default paginate;
