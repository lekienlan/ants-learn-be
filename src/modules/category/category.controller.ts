import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit, pick } from 'lodash';
import { PAGINATE_OPTIONS } from 'middlewares/paginate/paginate.constant';
import type { IPaginateOptions } from 'middlewares/paginate/paginate.interface';
import catchAsync from 'utils/catchAsync';

import { categoryService } from '.';
import type { ICategoryPayload } from './category.interface';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = omit(req.query, PAGINATE_OPTIONS);
  const options: IPaginateOptions = pick<Record<string, any>>(
    req.query,
    PAGINATE_OPTIONS
  );

  const categories = await categoryService.queryCategories(filter, options);

  res.send(categories);
});

export const addCategory = catchAsync(
  async (req: Request<{}, {}, ICategoryPayload>, res: Response) => {
    const { name, type, color, icon, userId } = req.body;
    const category = await categoryService.addCategory({
      name,
      type,
      color,
      icon,
      userId
    });

    res.status(StatusCodes.CREATED).send(category);
  }
);
