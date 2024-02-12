import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const params = {
  query: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string(),
    ...joiPaginate
  })
};
