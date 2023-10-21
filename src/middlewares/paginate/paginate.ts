import { startCase } from 'lodash';
import type { Document, Model, Schema } from 'mongoose';

import type { IPaginateOptions, IPaginateResult } from './paginate.interface';

const paginate = <T extends Document, U extends Model<U>>(
  schema: Schema<T>
): void => {
  schema.static(
    'paginate',
    async function (
      filter: Record<string, any>,
      options: IPaginateOptions
    ): Promise<IPaginateResult> {
      const { sortBy, limit, page = 1, pick, populate } = options;
      const skip = (page - 1) * (limit || 0);
      let sort = '';
      if (sortBy) {
        const sortingList = sortBy.split(',').map((sortOption: string) => {
          const [key, order = 'asc'] = sortOption.split(':');
          return `${order === 'desc' ? '-' : ''}${key}`;
        });
        sort = sortingList.join('');
      } else {
        sort = '-createdAt';
      }

      Object.keys(filter).forEach((key) => {
        // if filter is an array
        if (Array.isArray(filter[key])) {
          const [gte, lte] = filter[key];
          if (gte || lte) {
            filter[key] = {
              ...(gte ? { $gte: gte } : {}),
              ...(lte ? { $lte: lte } : {})
            };
          } else {
            delete filter[key];
          }
        } else {
          filter[key] = { $in: filter[key].split(',') };
        }
      });

      const [totalResults, results] = await Promise.all([
        this.countDocuments(filter).exec(),
        this.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select(pick?.replace(',', ' '))
          .populate(
            populate?.split(',').map((populateOption: string) => ({
              path: populateOption,
              model: startCase(populateOption)
            }))
          )
          .exec()
      ]);

      const totalPages = limit ? Math.ceil(totalResults / limit) : 1;

      return {
        results,
        page: parseInt(page.toString(), 10),
        limit: limit ? parseInt(limit.toString(), 10) : undefined,
        totalPages,
        totalResults
      };
    }
  );
};

export default paginate;
