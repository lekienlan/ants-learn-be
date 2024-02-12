import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

export const params = Joi.object().keys({
  query: Joi.object().keys({
    ...joiPaginate,
    transaction_id: Joi.string()
  })
});
