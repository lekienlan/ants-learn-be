import type { Prisma } from '@prisma/client';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.categoriesWhereInput) => Promise<import("middlewares/paginate/paginate.interface").QueryResults<Prisma.categoriesWhereInput>>;
export declare const create: (data: Omit<Prisma.Args<typeof prisma.categories, 'create'>['data'], 'code'>) => Promise<{
    id: string;
    code: string;
    name: string;
    type: import(".prisma/client").$Enums.CategoryType;
    updatedAt: Date | null;
    createdAt: Date | null;
    userId: string | null;
} & {
    style: {
        color: string;
        icon: string;
    } | null;
}>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.categories, 'update'>['data']) => Promise<{
    id: string;
    code: string;
    name: string;
    type: import(".prisma/client").$Enums.CategoryType;
    updatedAt: Date | null;
    createdAt: Date | null;
    userId: string | null;
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
    code: string;
    name: string;
    type: import(".prisma/client").$Enums.CategoryType;
    updatedAt: Date | null;
    createdAt: Date | null;
    userId: string | null;
} & {
    style: {
        color: string;
        icon: string;
    } | null;
}>;
