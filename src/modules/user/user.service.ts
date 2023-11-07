import type { Prisma } from '@prisma/client';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import { tokenService } from 'modules/token';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.transactionsWhereInput
) => {
  const users = await paginate<Prisma.transactionsWhereInput>(
    prisma.users,
    params
  );

  return users;
};

export const create = async (
  data: Prisma.Args<typeof prisma.users, 'create'>['data']
) => {
  return prisma.users.create({ data });
};

export const findOrCreate = async (
  data: Prisma.Args<typeof prisma.users, 'create'>['data']
) => {
  const user = await prisma.users.upsert({
    where: {
      email: data.email
    },
    update: {},
    create: data
  });
  return user;
};

export const findByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({ where: { email } });

  return user;
};

export const findById = async (id: string) => {
  const user = await prisma.users.findFirst({ where: { id } });
  return user;
};

export const findByAccessToken = async (accessToken: string) => {
  const payload = tokenService.decode(accessToken);

  if (!payload.sub) throw new Error('Token invalid');

  const user = await prisma.users.findFirst({
    where: { id: payload.sub as string }
  });

  return user;
};
