import Joi from 'joi';

export const joiPaginate = {
  sort_by: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
  pick: Joi.string(),
  populate: Joi.string(),
  created_at: Joi.array().items(Joi.date().allow(''))
};
