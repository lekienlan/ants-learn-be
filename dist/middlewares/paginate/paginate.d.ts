/// <reference types="lodash" />
import type { PaginateOptions, QueryResults } from './paginate.interface';
export declare const paginateFilter: (filter: Record<string, any>) => import("lodash").Omit<Record<string, any>, "sortBy" | "limit" | "page">;
declare const paginate: <T = Record<string, any>>(model: any, params: T & PaginateOptions) => Promise<QueryResults<T>>;
export default paginate;
