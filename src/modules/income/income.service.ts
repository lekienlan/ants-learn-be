import type {
  IPaginateOptions,
  IPaginateResult
} from 'middlewares/paginate/paginate.interface';
import { userService } from 'modules/user';

import type {
  IIncome,
  IIncomeDoc,
  IIncomePayload,
  IIncomeTotalAmount
} from './income.interface';
import Income from './income.model';

export const queryIncomes = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IPaginateResult<IIncome>> => {
  const incomes = await Income.paginate(filter, options);
  return incomes;
};

export const queryIncomesTotalAmount = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IIncomeTotalAmount> => {
  const incomes = await Income.paginate(filter, options);
  const user = (await userService.getUserById(filter.userId)) || undefined;
  const totalAmount = incomes.results.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);

  return {
    totalAmount,
    user
  };
};

export const addIncome = async (body: IIncomePayload): Promise<IIncomeDoc> => {
  const income = await Income.create(body);

  return income.populate('user');
};
