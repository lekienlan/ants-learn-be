import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const name = Joi.string().required();
const type = Joi.string().only().allow('expense', 'income').required();
const userId = Joi.string();

const style = Joi.object().keys({
  color: Joi.string(),
  icon: Joi.string()
});

export const basePayload = {
  body: Joi.object().keys({
    name,
    type,
    style,
    userId
  })
};
export const createPayload = basePayload;

export const updatePayload = basePayload.body.keys({
  name: name.optional(),
  type: type.optional(),
  style: style.optional()
});

export const params = {
  query: Joi.object().keys({
    ...joiPaginate,
    type: Joi.string().only().allow('expense', 'income')
  })
};
