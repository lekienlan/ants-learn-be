import type { IPaginateOptions, IPaginateResult } from 'middlewares/paginate/paginate.interface';
import type { IPeriod, IPeriodDoc, IPeriodPayload, IPeriodUpdatePayload } from './period.interface';
export declare const findMany: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<IPeriod>>;
export declare const findOne: ({ id }: {
    id: string;
}) => Promise<IPeriodDoc | undefined>;
export declare const create: (data: IPeriodPayload) => Promise<IPeriodDoc>;
export declare const update: (data: IPeriodUpdatePayload) => Promise<IPeriodDoc | null>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<IPeriodDoc | null>;
