import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const amountSchema = Joi.number();
const dateSchema = Joi.date();
const noteSchema = Joi.string().max(50);
const categoryIdSchema = Joi.string();
const typeSchema = Joi.string().valid('income', 'expense', 'budget');
const periodIdSchema = Joi.string();

export const createPayload = {
  body: Joi.object().keys({
    amount: amountSchema.required(),
    date: dateSchema,
    note: noteSchema,
    categoryId: categoryIdSchema,
    type: typeSchema,
    periodId: Joi.when('amount', {
      is: Joi.number().less(0),
      then: periodIdSchema.required(),
      otherwise: null
    })
  })
};

export const updatePayload = {
  body: Joi.object().keys({
    amount: amountSchema,
    date: dateSchema,
    note: noteSchema,
    categoryId: categoryIdSchema,
    periodId: periodIdSchema,
    type: typeSchema
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
