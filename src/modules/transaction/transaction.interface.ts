import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { ICategory } from 'modules/category/category.interface';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface ITransaction {
  amount: number;
  userId: string;
  categoryId?: string;
  user: IUser;
  category: ICategory;
  date?: Date;
  note?: string;
  currency?: string;
  periodId?: string;
}

export interface ITransactionPayload
  extends Omit<ITransaction, 'user' | 'category'> {}
export interface ITransactionUpdatePayload
  extends Omit<ITransactionPayload, 'userId'> {
  id: string;
}

export interface ITransactionTotalAmount {
  user?: IUser;
  totalAmount: number;
}

export interface ITransactionDoc extends ITransaction, Document {}
export interface ITransactionModel extends Model<ITransactionDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<ITransactionDoc>>;
}
