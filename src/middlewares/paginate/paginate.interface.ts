import type { Document } from 'mongoose';

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
