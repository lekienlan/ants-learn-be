import type { IPaginateOptions, IPaginateResult } from '../../middlewares/paginate/paginate.interface';
import type { IUser, IUserDoc } from './user.interface';
export declare const create: (userBody: IUser) => Promise<IUser>;
export declare const findByEmail: (email: string) => Promise<IUserDoc | null>;
export declare const findById: (id: string) => Promise<IUserDoc | null>;
export declare const findByAccessToken: (accessToken: string) => Promise<IUserDoc | null>;
export declare const findAll: (filter: Record<string, any>, options: IPaginateOptions) => Promise<IPaginateResult<IUser>>;
