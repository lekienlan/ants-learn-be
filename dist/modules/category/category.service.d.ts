import type { IPaginateOptions, IPaginateResult } from '../../middlewares/paginate/paginate.interface';
import type { ICategory, ICategoryDoc, ICategoryPayload, ICategoryUpdatePayload } from './category.interface';
export declare const findMany: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<ICategory>>;
export declare const create: (data: ICategoryPayload) => Promise<ICategoryDoc>;
export declare const update: (data: ICategoryUpdatePayload) => Promise<ICategoryDoc | null>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<ICategoryDoc | null>;
