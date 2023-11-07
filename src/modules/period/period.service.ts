import type { periods, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.periodsWhereInput,
  include?: Prisma.periodsInclude
) => {
  const list = await paginate<periods>(prisma.periods, params, include);
  return list;
};

export const findOne = async ({ id }: { id: string }) => {
  const period = await prisma.periods.findFirst({ where: { id } });

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};

export const create = async (
  data: Prisma.Args<typeof prisma.periods, 'create'>['data']
) => {
  const period = await prisma.periods.create({ data });

  return period;
};

export const update = async (
  id: string,
  data: Prisma.Args<typeof prisma.periods, 'update'>['data']
) => {
  const period = await prisma.periods.update({ where: { id }, data });

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};

export const remove = async ({ id }: { id: string }) => {
  const period = await prisma.periods.delete({ where: { id } });

  if (!period) throw new ApiError(StatusCodes.NOT_FOUND, 'Period not found');

  return period;
};
