import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';

import type { IIncome, IIncomeDoc, IIncomePayload } from './income.interface';
import Income from './income.model';

export const queryIncomes = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<IIncome>> => {
  const incomes = await Income.paginate(filter, options);
  return incomes;
};

export const addIncome = async (body: IIncomePayload): Promise<IIncomeDoc> => {
  const income = await Income.create(body);

  return income.populate([
    { path: 'user', model: 'User' },
    { path: 'category', model: 'Category' }
  ]);
};
