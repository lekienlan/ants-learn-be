import type { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { snakeCase } from 'lodash';
import ApiError from 'middlewares/error/ApiError';
import paginate from 'middlewares/paginate';
import type { PaginateOptions } from 'middlewares/paginate/paginate.interface';
import prisma from 'prisma';
import { removeDiacritics } from 'utils';

import type { IPigDoc, IPigPayload, IPigUpdatePayload } from './pig.interface';
import Pig from './pig.model';

export const findMany = async (
  params: PaginateOptions & Prisma.pigsWhereInput
) => {
  const piggies = await paginate(prisma.pigs, params);
  return piggies;
};

export const create = async (data: IPigPayload): Promise<IPigDoc> => {
  const pig = await Pig.create(data);

  if (data.userId) {
    return pig.populate('user');
  }

  return pig;
};

export const update = async (
  data: IPigUpdatePayload
): Promise<IPigDoc | null> => {
  const { id, ...payload } = data;

  const pig = await Pig.findByIdAndUpdate(
    id,
    {
      ...payload,
      ...(data?.name
        ? { code: snakeCase(removeDiacritics(data.name)) }
        : undefined)
    },
    {
      returnDocument: 'after'
    }
  );

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};

export const remove = async ({
  id
}: {
  id: string;
}): Promise<IPigDoc | null> => {
  const pig = await Pig.findByIdAndRemove(id);

  if (!pig) throw new ApiError(StatusCodes.NOT_FOUND, 'Pig not found');

  return pig;
};
