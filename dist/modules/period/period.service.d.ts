import type { periods, Prisma } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.periodsWhereInput, include?: Prisma.periodsInclude) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<{
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
}>>;
export declare const findOne: ({ id }: {
    id: string;
}) => Promise<{
    transactions: {
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
    }[];
} & {
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
}>;
export declare const create: (data: Prisma.Args<typeof prisma.periods, 'create'>['data']) => Promise<{
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
}>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.periods, 'update'>['data']) => Promise<{
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
}>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<{
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
}>;
