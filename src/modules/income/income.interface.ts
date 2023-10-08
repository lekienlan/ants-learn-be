import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { ICategory } from 'modules/category/category.interface';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface IIncome {
  amount: number;
  userId: string;
  categoryId?: string;
  date?: Date;
  note?: string;
  unit?: string;
  user: IUser;
  category: ICategory;
}

export interface IIncomePayload extends Omit<IIncome, 'user' | 'category'> {}

export interface IIncomeTotalAmount {
  user?: IUser;
  totalAmount: number;
}

export interface IIncomeDoc extends IIncome, Document {}
export interface IIncomeModel extends Model<IIncomeDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<IIncome>>;
}
