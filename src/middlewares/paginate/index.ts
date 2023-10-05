import type { Document, Model, Schema } from 'mongoose';

export interface IPaginateResult<T = Document> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IPaginateOptions {
  sortBy?: string; // email:desc
  limit?: number;
  pickFields?: string; // Ex: id amount
  page?: number;
}

const paginate = <T extends Document, U extends Model<U>>(
  schema: Schema<T>
): void => {
  /**
   * @typedef {Object} IPaginateResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<IPaginateResult>}
   */
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
        sort = '-updatedAt';
      }

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
