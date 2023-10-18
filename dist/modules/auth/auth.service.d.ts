import type { IUserDoc, IUserWithTokens } from 'modules/user/user.interface';
export declare const loginWithEmail: (email: string) => Promise<IUserDoc>;
export declare const refresh: (refreshToken: string) => Promise<IUserWithTokens>;
