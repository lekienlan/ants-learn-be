import Joi from 'joi';

export const joiSocial = {
  user: Joi.object().keys({
    email: Joi.string().required()
  })
};

export const joiRefresh = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};
