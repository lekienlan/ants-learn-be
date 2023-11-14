/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import type { users } from '@prisma/client';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import type { Moment } from 'moment';
import type { AccessAndRefreshTokens } from './token.interface';
export declare const generate: (userId: string, expires: Moment, secret?: string) => string;
export declare const decode: (token: string) => string | JwtPayload;
export declare const create: (token: string, userId: string, expires: Moment, blacklisted?: boolean) => Promise<{
    id: string;
    blacklisted: boolean;
    expires: Date;
    token: string;
    userId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const verify: (token: string) => Promise<import("mongoose").Document<unknown, {}, import("./token.interface").ITokenDoc> & import("./token.interface").ITokenDoc & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const generateTokens: (user: users) => Promise<AccessAndRefreshTokens>;
export declare const getAccessTokenFromRequest: (header: Request) => string;
