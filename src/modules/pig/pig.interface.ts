import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { IPeriod } from 'modules/period/period.interface';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface IPig {
  name?: string;
  code?: string;
  type?: 'expense' | 'income';
  user: IUser;
  userId?: string;
  periodId: string;
  period: IPeriod;
  style?: {
    icon?: string;
    color?: string;
  };
}

export interface IPigPayload
  extends Omit<IPig, 'user' | 'code' | 'periodId' | 'period'> {}
export interface IPigUpdatePayload
  extends Omit<IPig, 'user' | 'code' | 'periodId' | 'period'> {
  id: string;
}

export interface IPigDoc extends IPig, Document {}

export interface IPigModel extends Model<IPigDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<IPig>>;
}
