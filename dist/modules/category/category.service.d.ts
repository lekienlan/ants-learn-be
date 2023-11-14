import type { categories, Prisma } from '@prisma/client';
import type { PaginateOptions, QueryResults } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
export declare const findMany: (params: PaginateOptions & Prisma.categoriesWhereInput, include?: Prisma.categoriesInclude) => Promise<QueryResults<categories>>;
export declare const create: (data: Prisma.Args<typeof prisma.categories, 'create'>['data']) => Promise<categories>;
export declare const update: (id: string, data: Prisma.Args<typeof prisma.categories, 'update'>['data']) => Promise<categories>;
export declare const remove: ({ id }: {
    id: string;
}) => Promise<categories>;
