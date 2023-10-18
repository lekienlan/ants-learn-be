import Joi from 'joi';
export declare const basePayload: {
    body: Joi.ObjectSchema<any>;
};
export declare const createPayload: {
    body: Joi.ObjectSchema<any>;
};
export declare const updatePayload: Joi.ObjectSchema<any>;
export declare const params: {
    query: Joi.ObjectSchema<any>;
};
