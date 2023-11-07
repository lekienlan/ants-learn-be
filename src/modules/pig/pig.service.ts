import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.pigsWhereInput
) => {
  const piggies = await paginate(prisma.pigs, params);
  return piggies;
};

export const create = async (
  data: Prisma.Args<typeof prisma.pigs, 'create'>['data']
) => {
  const pig = await prisma.pigs.create({ data });

  return pig;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.pigs, 'update'>['data']
) => {
  const pig = await prisma.pigs.update({
    where: { id },
    data
  });

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};

export const remove = async ({ id }: { id: string }) => {
  const pig = await prisma.pigs.delete({ where: { id } });

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};
