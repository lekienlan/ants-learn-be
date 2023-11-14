import type { Prisma, users } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.transactionsWhereInput, include?: Prisma.usersInclude) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}>>;
export declare const create: (data: Prisma.Args<typeof prisma.users, 'create'>['data']) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const findOrCreate: (data: Prisma.Args<typeof prisma.users, 'create'>['data']) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const findByEmail: (email: string) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} | null>;
export declare const findById: (id: string) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} | null>;
export declare const findByAccessToken: (accessToken: string) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} | null>;
