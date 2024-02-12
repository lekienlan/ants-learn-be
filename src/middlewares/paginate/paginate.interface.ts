export interface IPaginateResult<T> {
  results: T[];
  page: number;
  limit?: number;
  total_pages: number;
  total_results: number;
}

export interface IPaginateOptions {
  sort_by?: string; // email:desc
  limit?: number;
  pick?: string; // Ex: id amount
  page?: number;
  populate?: string;
}
export type PaginateOptions = {
  sort_by?: string; // email:desc
  limit?: string;
  pick?: string; // Ex: id amount
  page?: string;
};

export type QueryResults<T> = {
  results: T[];
  page: number;
  limit: number;
  total_pages: number;
  total_results: number;
};
