import type { IPaginateOptions, IPaginateResult } from 'middlewares/paginate/paginate.interface';
import type { IPig, IPigDoc, IPigPayload, IPigUpdatePayload } from './pig.interface';
export declare const findMany: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<IPig>>;
export declare const create: (data: IPigPayload) => Promise<IPigDoc>;
export declare const update: (data: IPigUpdatePayload) => Promise<IPigDoc | null>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<IPigDoc | null>;
