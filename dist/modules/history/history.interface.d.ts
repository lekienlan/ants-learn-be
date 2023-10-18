import type { IPaginateOptions, IPaginateResult } from '../../middlewares/paginate/paginate.interface';
import type { ITransaction } from '../../modules/transaction/transaction.interface';
import type { Document, Model } from 'mongoose';
export interface IHistory {
    transactionId: string;
    data: ITransaction;
    state: 'original' | 'modified' | 'deleted';
}
export interface IHistoryDoc extends IHistory, Document {
}
export interface IHistoryModel extends Model<IHistoryDoc> {
    paginate(filter: Record<string, any>, options: IPaginateOptions): Promise<IPaginateResult<IHistory>>;
}
