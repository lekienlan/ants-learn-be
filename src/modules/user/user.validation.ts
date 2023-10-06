import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const userParams = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    ...joiPaginate
  })
};
