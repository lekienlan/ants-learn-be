import Joi from 'joi';

export const socialUser = {
  user: Joi.object().keys({
    email: Joi.string().required()
  })
};

export const refreshPayload = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};
