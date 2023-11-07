import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type prisma from 'prisma';
import catchAsync from 'utils/catchAsync';

import { categoryService } from '.';

export const findMany = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.findMany(req.query);

  res.send(categories);
});

export const create = catchAsync(
  async (
    req: Request<
      {},
      {},
      Prisma.Args<typeof prisma.categories, 'create'>['data']
    >,
    res: Response
  ) => {
    const { name, type, style, userId } = req.body;
    const category = await categoryService.create({
      name,
      type,
      style,
      userId
    });

    res.status(StatusCodes.CREATED).send(category);
  }
);

export const update = catchAsync(
  async (
    req: Request<
      { id: string },
      {},
      Prisma.Args<typeof prisma.categories, 'update'>['data']
    >,
    res: Response
  ) => {
    const { name, type, style } = req.body;

    const category = await categoryService.update(req.params.id, {
      name,
      type,
      style
    });

    res.send(category);
  }
);

export const remove = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const category = await categoryService.remove({
      id: req.params.id
    });

    res.send(category);
  }
);
