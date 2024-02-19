import { omit } from 'lodash';
import { convertStringToType } from 'utils';

import type { PaginateOptions, QueryResults } from './paginate.interface';

export const paginateFilterSql = (filter: Record<string, any>): string => {
  const conditions: string[] = [];

  Object.keys(filter).forEach((key) => {
    if (!filter[key]) return;
    // if filter is a 2 items array
    if (Array.isArray(filter[key]) && filter[key].length === 2) {
      const [gte, lte] = filter[key];

      if (gte && lte) {
        conditions.push(`${key} BETWEEN ${gte} AND ${lte}`);
      } else if (gte) {
        conditions.push(`${key} >= ${gte}`);
      }
      // Add other conditions as needed
    } else {
      conditions.push(
        `${key} IN (${filter[key]
          .split(',')
          .map((value: any) => {
            return `'${value}'`;
          })
          .join(',')})`
      );
    }
  });

  if (conditions.length > 0) {
    return `${conditions.join(' AND ')}`;
  }
  return '';
};

export const paginateFilter = (filter: Record<string, any>) => {
  const formattedFilter = omit(filter, ['limit', 'sort_by', 'page']);
  Object.keys(formattedFilter).forEach((key) => {
    // if filter is an 2 items array
    if (Array.isArray(formattedFilter[key]) && formattedFilter[key].length) {
      const [gte, lte] = formattedFilter[key];

      if (!gte) {
        delete formattedFilter[key];
        return;
      }

      if (!lte) {
        formattedFilter[key] = {
          gte: convertStringToType(gte)
        };
        return;
      }

      formattedFilter[key] = {
        gte: convertStringToType(gte),
        lte: convertStringToType(lte)
      };
    } else {
      formattedFilter[key] = { in: formattedFilter[key].split(',') };
    }
  });

  return formattedFilter;
};

const paginate = async <T>(
  model: any,
  params: PaginateOptions,
  include?: Record<string, any>
): Promise<QueryResults<T>> => {
  const { sort_by = '-updated_at', limit, page, ...query } = params;

  const _limit = limit ? parseInt(limit, 10) : 10;
  const _page = page ? parseInt(page, 10) : 1;
  const skip = (_page - 1) * (_limit || 0);

  const _sortBy: { field: string; direction: 'asc' | 'desc' } =
    sort_by.startsWith('-')
      ? { field: sort_by.substring(1), direction: 'desc' }
      : { field: sort_by, direction: 'asc' };

  const total_results = await model.count({ where: paginateFilter(query) });
  const results = await model.findMany({
    where: paginateFilter(query),
    skip,
    take: _limit,
    orderBy: {
      [_sortBy.field]: _sortBy.direction
    },
    include
  });

  const total_pages = Math.ceil(total_results / _limit) || 1;

  return {
    results,
    page: _page,
    limit: _limit,
    total_pages,
    total_results
  };
};

export default paginate;
