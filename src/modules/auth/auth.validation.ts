import Joi from 'joi';

export const loginSocial = {
  user: Joi.object().keys({
    email: Joi.string().required()
  })
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};
