import type { histories, Prisma } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.historiesWhereInput, include?: Prisma.historiesInclude) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<{
    id: string;
    state: string;
    userId: string;
    transactionId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    data: {
        amount: number;
        categoryId: string | null;
        currency: string | null;
        date: Date | null;
        note: string | null;
        periodId: string | null;
    };
}>>;
export declare const findTransHistories: ({ transactionId }: {
    transactionId: string;
}) => Promise<{
    id: string;
    state: string;
    userId: string;
    transactionId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    data: {
        amount: number;
        categoryId: string | null;
        currency: string | null;
        date: Date | null;
        note: string | null;
        periodId: string | null;
    };
}>;
export declare const create: (data: Prisma.Args<typeof prisma.histories, 'create'>['data']) => Promise<{
    id: string;
    state: string;
    userId: string;
    transactionId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    data: {
        amount: number;
        categoryId: string | null;
        currency: string | null;
        date: Date | null;
        note: string | null;
        periodId: string | null;
    };
}>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<{
    id: string;
    state: string;
    userId: string;
    transactionId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    data: {
        amount: number;
        categoryId: string | null;
        currency: string | null;
        date: Date | null;
        note: string | null;
        periodId: string | null;
    };
}>;
