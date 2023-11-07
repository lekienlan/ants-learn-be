import type { Prisma } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.pigsWhereInput) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<Prisma.pigsWhereInput>>;
export declare const create: (data: Prisma.Args<typeof prisma.pigs, 'create'>['data']) => Promise<{
    id: string;
    name: string;
    userId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    style: {
        color: string;
        icon: string;
    } | null;
}>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.pigs, 'update'>['data']) => Promise<{
    id: string;
    name: string;
    userId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    style: {
        color: string;
        icon: string;
    } | null;
}>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<{
    id: string;
    name: string;
    userId: string;
    updatedAt: Date | null;
    createdAt: Date | null;
} & {
    style: {
        color: string;
        icon: string;
    } | null;
}>;
