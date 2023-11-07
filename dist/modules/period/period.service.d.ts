import type { Prisma } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.periodsWhereInput) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<Prisma.periodsWhereInput>>;
export declare const findOne: ({ id }: {
    id: string;
}) => Promise<{
    id: string;
    v: number;
    budget: number;
    createdAt: Date;
    endDate: Date;
    expense: number;
    members: string[];
    pigId: string;
    repeat: boolean;
    startDate: Date;
    updatedAt: Date;
}>;
export declare const create: (data: Prisma.Args<typeof prisma.periods, 'create'>['data']) => Promise<{
    id: string;
    v: number;
    budget: number;
    createdAt: Date;
    endDate: Date;
    expense: number;
    members: string[];
    pigId: string;
    repeat: boolean;
    startDate: Date;
    updatedAt: Date;
}>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.periods, 'update'>['data']) => Promise<{
    id: string;
    v: number;
    budget: number;
    createdAt: Date;
    endDate: Date;
    expense: number;
    members: string[];
    pigId: string;
    repeat: boolean;
    startDate: Date;
    updatedAt: Date;
}>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<{
    id: string;
    v: number;
    budget: number;
    createdAt: Date;
    endDate: Date;
    expense: number;
    members: string[];
    pigId: string;
    repeat: boolean;
    startDate: Date;
    updatedAt: Date;
}>;
