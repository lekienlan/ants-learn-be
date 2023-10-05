import Joi from 'joi';

export const incomePayload = {
  body: Joi.object().keys({
    amount: Joi.number().required()
    // categoryId: Joi.string().required(),
    // date: Joi.date()
  })
};

export const incomeParams = {
  query: Joi.object().keys({
    userId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};
