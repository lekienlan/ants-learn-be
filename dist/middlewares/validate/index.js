"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var joi_1 = __importDefault(require("joi"));
var lodash_1 = require("lodash");
var ApiError_1 = __importDefault(require("../../middlewares/error/ApiError"));
var validate = function (schema) {
    return function (req, _res, next) {
        var validSchema = (0, lodash_1.pick)(schema, ['params', 'query', 'body']);
        var object = (0, lodash_1.pick)(req, Object.keys(validSchema));
        var _a = joi_1.default.compile(validSchema)
            .prefs({ errors: { label: 'key' } })
            .validate(object), value = _a.value, error = _a.error;
        if (error) {
            var errorMessage = error.details
                .map(function (details) { return details.message; })
                .join(', ');
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessage));
        }
        Object.assign(req, value);
        return next();
    };
};
exports.default = validate;
//# sourceMappingURL=index.js.map