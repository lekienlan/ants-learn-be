import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const joiCategoryPayload = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().only().allow('expense', 'income').required(),
    color: Joi.string(),
    icon: Joi.string()
  })
};

export const joiCategoryParams = {
  query: Joi.object().keys({
    ...joiPaginate,
    type: Joi.string().only().allow('expense', 'income')
  })
};
