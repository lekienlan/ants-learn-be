/// <reference types="lodash" />
import type { PaginateOptions, QueryResults } from './paginate.interface';
export declare const paginateFilter: (filter: Record<string, any>) => import("lodash").Omit<Record<string, any>, "sortBy" | "limit" | "page">;
declare const paginate: <T>(model: any, params: PaginateOptions, include?: Record<string, any>) => Promise<QueryResults<T>>;
export default paginate;
