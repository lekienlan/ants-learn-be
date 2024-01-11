export interface IPaginateResult<T> {
  results: T[];
  page: number;
  limit?: number;
  totalPages: number;
  totalResults: number;
}

export interface IPaginateOptions {
  sortBy?: string; // email:desc
  limit?: number;
  pick?: string; // Ex: id amount
  page?: number;
  populate?: string;
}
export type PaginateOptions = {
  sortBy?: string; // email:desc
  limit?: string;
  pick?: string; // Ex: id amount
  page?: string;
};

export type QueryResults<T> = {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};
