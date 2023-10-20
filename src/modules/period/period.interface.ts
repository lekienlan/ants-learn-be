import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import type { Document, Model } from 'mongoose';

export interface IPeriod {
  pigId?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  members?: string[];
  repeat?: boolean;
  status?: string;
  expense?: number;
}

export interface IPeriodPayload extends Omit<IPeriod, 'user' | 'code'> {}
export interface IPeriodUpdatePayload extends Omit<IPeriod, 'user' | 'code'> {
  id: string;
}

export interface IPeriodDoc extends IPeriod, Document {}

export interface IPeriodModel extends Model<IPeriodDoc> {
  paginate(
    filter: Record<string, any>,
    options: IPaginateOptions
  ): Promise<IPaginateResult<IPeriod>>;
}
