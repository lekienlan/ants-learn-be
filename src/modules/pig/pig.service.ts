import type { pigs, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import { periodService } from 'modules/period';
import prisma from 'prisma';

export const findMany = async (
  params: PaginateOptions & Prisma.pigsWhereInput,
  include?: Prisma.pigsInclude
) => {
  const list = await paginate<pigs>(prisma.pigs, params, {
    periods: {
      include: {
        transactions: {
          where: {
            type: 'expense'
          }
        }
      }
    },
    ...include
  });

  return list;
};

export const findFirst = async ({ id }: { id: string }) => {
  const pig = await prisma.pigs.findFirst({
    where: { id },
    include: {
      periods: {
        include: {
          transactions: {
            where: {
              type: 'expense'
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      }
    }
  });

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};

export const create = async (data: Prisma.pigsUncheckedCreateInput) => {
  const pig = await prisma.pigs.create({ data, include: { user: true } });

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
  const pig = await prisma.pigs.update({
    where: { id },
    data: { status: 'deleted' }
  });
  const period = await prisma.periods.findFirst({
    where: { pig_id: id, status: { in: ['running'] } }
  });

  if (period) {
    await periodService.remove({ id: period?.id });
  }

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};
