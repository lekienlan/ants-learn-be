import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const startDate = Joi.date();
const endDate = Joi.date();
const budget = Joi.number();
const members = Joi.array().items(Joi.string());
const repeat = Joi.boolean();
const status = Joi.string();
const pigId = Joi.string();

export const createPayload = {
  body: Joi.object().keys({
    startDate: startDate.required(),
    endDate: endDate.required(),
    budget: budget.required(),
    pigId: pigId.required(),
    members,
    repeat
  })
};

export const updatePayload = {
  body: Joi.object().keys({
    startDate,
    endDate,
    budget,
    members,
    repeat,
    status,
    pigId
  })
};

export const params = {
  query: Joi.object().keys({
    ...joiPaginate
  })
};
