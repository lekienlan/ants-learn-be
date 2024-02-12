import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const start_date = Joi.date();
const end_date = Joi.date();
const budget = Joi.number();
const members = Joi.array().items(Joi.string());
const repeat = Joi.boolean();
const status = Joi.string();
const pig_id = Joi.string();

export const createPayload = {
  body: Joi.object().keys({
    start_date: start_date.required(),
    end_date: end_date.required(),
    budget: budget.required(),
    pig_id: pig_id.required(),
    members,
    repeat
  })
};

export const updatePayload = {
  body: Joi.object().keys({
    start_date,
    end_date,
    budget,
    members,
    repeat,
    status,
    pig_id
  })
};

export const params = {
  query: Joi.object().keys({
    ...joiPaginate
  })
};
