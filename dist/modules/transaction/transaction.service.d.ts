import type { IPaginateOptions, IPaginateResult } from '../../middlewares/paginate/paginate.interface';
import type { ITransactionDoc, ITransactionPayload, ITransactionUpdatePayload } from './transaction.interface';
export declare const findMany: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<ITransactionDoc>>;
export declare const findOne: ({ id }: {
    id: string;
}) => Promise<ITransactionDoc>;
export declare const create: (data: ITransactionPayload) => Promise<ITransactionDoc>;
export declare const update: (data: ITransactionUpdatePayload) => Promise<ITransactionDoc>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<ITransactionDoc>;
