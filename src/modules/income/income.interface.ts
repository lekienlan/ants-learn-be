import type { IPaginateResult } from 'middlewares/paginate';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface IIncome {
  amount: number;
  userId: string;
  categoryId: string;
  date?: Date;
  unit?: string;
  user: IUser;
}

export interface IIncomePayload extends Omit<IIncome, 'user'> {}

export interface IIncomeTotalAmount {
  user?: IUser;
  totalAmount: number;
}

export interface IIncomeDoc extends IIncome, Document {}
export interface IIncomeModel extends Model<IIncomeDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<IPaginateResult<IIncome>>;
}
