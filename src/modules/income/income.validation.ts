import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const joiIncomePayload = {
  body: Joi.object().keys({
    amount: Joi.number().required(),
    date: Joi.date(),
    note: Joi.string().max(50),
    categoryId: Joi.string()
  })
};

export const joiIncomeParams = {
  query: Joi.object().keys({
    ...joiPaginate,
    amount: Joi.array().items(Joi.number())
  })
};
