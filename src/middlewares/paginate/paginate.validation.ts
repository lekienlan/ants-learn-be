import Joi from 'joi';

export const joiPaginate = {
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
  pick: Joi.string(),
  populate: Joi.string(),
  createdAt: Joi.array().items(Joi.date().allow(''))
};
