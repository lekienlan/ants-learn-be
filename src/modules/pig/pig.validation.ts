import Joi from 'joi';
import { joiPaginate } from 'middlewares/paginate/paginate.validation';

const nameSchema = Joi.string().required();

const styleSchema = Joi.object().keys({
  color: Joi.string(),
  icon: Joi.string()
});

export const basePayload = {
  body: Joi.object().keys({
    name: nameSchema,
    style: styleSchema
  })
};
export const createPayload = basePayload;

export const updatePayload = basePayload.body.keys({
  name: nameSchema.optional(),
  style: styleSchema.optional()
});

export const params = {
  query: Joi.object().keys({
    ...joiPaginate
  })
};
