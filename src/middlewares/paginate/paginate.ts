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
      const { sortBy, limit = 10, page = 1, pickFields } = options;
      const skip = (page - 1) * limit;
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
        }
      });

      const [totalResults, results] = await Promise.all([
        this.countDocuments(filter).exec(),
        this.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select(pickFields)
          .exec()
      ]);

      const totalPages = Math.ceil(totalResults / limit);

      return {
        results,
        page: parseInt(page.toString(), 10),
        limit: parseInt(limit.toString(), 10),
        totalPages,
        totalResults
      };
    }
  );
};

export default paginate;
