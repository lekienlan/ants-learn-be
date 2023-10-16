import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const amountSchema = Joi.number().required();
const dateSchema = Joi.date();
const noteSchema = Joi.string().max(50);
const categoryIdSchema = Joi.string();
const periodIdSchema = Joi.string();

export const createPayload = {
  body: Joi.object().keys({
    amount: amountSchema,
    date: dateSchema,
    note: noteSchema,
    categoryId: categoryIdSchema,
    periodId: Joi.when('amount', {
      is: Joi.number().less(0),
      then: periodIdSchema.required(),
      otherwise: periodIdSchema
    })
  })
};

export const updatePayload = {
  body: Joi.object().keys({
    amount: amountSchema,
    date: dateSchema,
    note: noteSchema,
    categoryId: categoryIdSchema
  })
};

export const params = Joi.object().keys({
  query: Joi.object().keys({
    ...joiPaginate,
    amount: Joi.array().items(Joi.number()),
    date: Joi.array().items(Joi.date()),
    categoryId: Joi.string()
  })
});
