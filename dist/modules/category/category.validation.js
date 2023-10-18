"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.updatePayload = exports.createPayload = exports.basePayload = void 0;
var joi_1 = __importDefault(require("joi"));
var paginate_validation_1 = require("../../middlewares/paginate/paginate.validation");
var nameSchema = joi_1.default.string().required();
var typeSchema = joi_1.default.string().only().allow('expense', 'income').required();
var styleSchema = joi_1.default.object().keys({
    color: joi_1.default.string(),
    icon: joi_1.default.string()
});
exports.basePayload = {
    body: joi_1.default.object().keys({
        name: nameSchema,
        type: typeSchema,
        style: styleSchema
    })
};
exports.createPayload = exports.basePayload;
exports.updatePayload = exports.basePayload.body.keys({
    name: nameSchema.optional(),
    type: typeSchema.optional(),
    style: styleSchema.optional()
});
exports.params = {
    query: joi_1.default.object().keys(__assign(__assign({}, paginate_validation_1.joiPaginate), { type: joi_1.default.string().only().allow('expense', 'income') }))
};
//# sourceMappingURL=category.validation.js.map