import type { IPaginateOptions, IPaginateResult } from 'middlewares/paginate/paginate.interface';
import type { IHistory, IHistoryDoc } from './history.interface';
export declare const findMany: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<IHistory>>;
export declare const findTransHistories: ({ transactionId }: {
    transactionId: string;
}) => Promise<IHistoryDoc[]>;
export declare const create: (data: IHistory) => Promise<IHistoryDoc>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<IHistoryDoc | null>;
