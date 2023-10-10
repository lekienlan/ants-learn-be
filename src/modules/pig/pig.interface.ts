import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface IPig {
  name: string;
  code: string;
  type: 'expense' | 'income';
  user: IUser;
  userId?: string;
  style?: {
    icon?: string;
    color?: string;
  };
}

export interface IPigPayload extends Omit<IPig, 'user' | 'code'> {}
export interface IPigUpdatePayload extends Omit<IPig, 'user' | 'code'> {
  id: string;
}

export interface IPigDoc extends IPig, Document {}

export interface IPigModel extends Model<IPigDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<IPig>>;
}
