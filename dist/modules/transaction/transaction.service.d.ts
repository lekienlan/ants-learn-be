import type { Prisma, transactions } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.transactionsWhereInput, include?: Prisma.transactionsInclude) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<{
    id: string;
    amount: number;
    currency: string | null;
    date: Date | null;
    note: string | null;
    periodId: string | null;
    type: string | null;
    userId: string;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}>>;
export declare const findOne: (where: Prisma.transactionsWhereInput) => Promise<{
    id: string;
    amount: number;
    currency: string | null;
    date: Date | null;
    note: string | null;
    periodId: string | null;
    type: string | null;
    userId: string;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const create: (data: Prisma.Args<typeof prisma.transactions, 'create'>['data']) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        updatedAt: Date | null;
        createdAt: Date | null;
    };
    period: {
        id: string;
        budget: number;
        endDate: Date;
        expense: number;
        members: string[];
        repeat: boolean;
        startDate: Date;
        updatedAt: Date | null;
        createdAt: Date | null;
        pigId: string | null;
    } | null;
    category: ({
        id: string;
        code: string;
        name: string;
        type: import(".prisma/client").$Enums.CategoryType;
        userId: string | null;
        updatedAt: Date | null;
        createdAt: Date | null;
    } & {
        style: {
            color: string;
            icon: string;
        } | null;
    }) | null;
} & {
    id: string;
    amount: number;
    currency: string | null;
    date: Date | null;
    note: string | null;
    periodId: string | null;
    type: string | null;
    userId: string;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.transactions, 'update'>['data']) => Promise<{
    id: string;
    amount: number;
    currency: string | null;
    date: Date | null;
    note: string | null;
    periodId: string | null;
    type: string | null;
    userId: string;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<{
    id: string;
    amount: number;
    currency: string | null;
    date: Date | null;
    note: string | null;
    periodId: string | null;
    type: string | null;
    userId: string;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
