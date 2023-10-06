import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const joiIncome = {
  amount: Joi.number()
};

export const joiIncomePayload = {
  body: Joi.object()
    .keys({
      ...joiIncome
    })
    .required()
};

export const joiIncomeParams = {
  query: Joi.object().keys({
    ...joiPaginate,
    amount: Joi.array().items(Joi.number())
  })
};
