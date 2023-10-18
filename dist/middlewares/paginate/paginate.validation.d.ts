import Joi from 'joi';
export declare const joiPaginate: {
    sortBy: Joi.StringSchema<string>;
    limit: Joi.NumberSchema<number>;
    page: Joi.NumberSchema<number>;
    pick: Joi.StringSchema<string>;
    populate: Joi.StringSchema<string>;
    createdAt: Joi.ArraySchema<any[]>;
};
