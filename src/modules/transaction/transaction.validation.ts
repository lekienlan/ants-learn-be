import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const amountSchema = Joi.number();
const dateSchema = Joi.date();
const noteSchema = Joi.string().max(50);
const categoryIdSchema = Joi.string();
const typeSchema = Joi.string();
const periodIdSchema = Joi.string();

export const createPayload = {
  body: Joi.object().keys({
    amount: amountSchema.required(),
    date: dateSchema,
    note: noteSchema,
    category_id: categoryIdSchema,
    type: typeSchema.required(),
    period_id: Joi.when('type', {
      is: 'expense',
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
    category_id: categoryIdSchema,
    period_id: periodIdSchema,
    type: typeSchema
  })
};

export const params = {
  query: Joi.object().keys({
    ...joiPaginate,
    amount: Joi.array().items(Joi.number()),
    date: Joi.array().items(Joi.date()),
    type: typeSchema,
    period_id: periodIdSchema,
    category_id: Joi.string()
  })
};
export const subtractParams = {
  query: Joi.object().keys({
    ...joiPaginate,
    type: Joi.string()
      .regex(/^[^,]+,[^,]+$/)
      .message('"type" can only allow two values')
      .required(),
    amount: Joi.array().items(Joi.number()),
    date: Joi.array().items(Joi.date()),
    period_id: periodIdSchema,
    category_id: Joi.string()
  })
};
