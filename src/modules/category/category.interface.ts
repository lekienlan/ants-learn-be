import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { IUser } from 'modules/user/user.interface';
import type { Document, Model } from 'mongoose';

export interface ICategory {
  name: string;
  code: string;
  type: 'expense' | 'income';
  user?: IUser;
  userId?: string;
  style?: {
    icon?: string | null;
    color?: string | null;
  } | null;
}

export interface ICategoryPayload extends Omit<ICategory, 'user' | 'code'> {}
export interface ICategoryUpdatePayload
  extends Omit<ICategory, 'user' | 'code'> {
  id: string;
}

export interface ICategoryDoc extends ICategory, Document {}

export interface ICategoryModel extends Model<ICategoryDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<ICategory>>;
}
