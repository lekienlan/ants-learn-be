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
exports.params = exports.updatePayload = exports.createPayload = void 0;
var joi_1 = __importDefault(require("joi"));
var paginate_validation_1 = require("../../middlewares/paginate/paginate.validation");
var amountSchema = joi_1.default.number().required();
var dateSchema = joi_1.default.date();
var noteSchema = joi_1.default.string().max(50);
var categoryIdSchema = joi_1.default.string();
var periodIdSchema = joi_1.default.string();
exports.createPayload = {
    body: joi_1.default.object().keys({
        amount: amountSchema,
        date: dateSchema,
        note: noteSchema,
        categoryId: categoryIdSchema,
        periodId: joi_1.default.when('amount', {
            is: joi_1.default.number().less(0),
            then: periodIdSchema.required(),
            otherwise: periodIdSchema
        })
    })
};
exports.updatePayload = {
    body: joi_1.default.object().keys({
        amount: amountSchema,
        date: dateSchema,
        note: noteSchema,
        categoryId: categoryIdSchema
    })
};
exports.params = joi_1.default.object().keys({
    query: joi_1.default.object().keys(__assign(__assign({}, paginate_validation_1.joiPaginate), { amount: joi_1.default.array().items(joi_1.default.number()), date: joi_1.default.array().items(joi_1.default.date()), categoryId: joi_1.default.string() }))
});
//# sourceMappingURL=transaction.validation.js.map