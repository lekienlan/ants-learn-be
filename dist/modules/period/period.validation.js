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
var paginate_validation_1 = require("middlewares/paginate/paginate.validation");
var startDate = joi_1.default.date();
var endDate = joi_1.default.date();
var budget = joi_1.default.number();
var members = joi_1.default.array().items(joi_1.default.string());
var expenses = joi_1.default.array().items(joi_1.default.string());
var repeat = joi_1.default.boolean();
var status = joi_1.default.string();
var pigId = joi_1.default.string();
exports.createPayload = {
    body: joi_1.default.object().keys({
        startDate: startDate.required(),
        endDate: endDate.required(),
        budget: budget.required(),
        pigId: pigId.required(),
        members: members,
        repeat: repeat,
        expenses: expenses
    })
};
exports.updatePayload = {
    body: joi_1.default.object().keys({
        startDate: startDate,
        endDate: endDate,
        budget: budget,
        members: members,
        expenses: expenses,
        repeat: repeat,
        status: status,
        pigId: pigId
    })
};
exports.params = {
    query: joi_1.default.object().keys(__assign({}, paginate_validation_1.joiPaginate))
};
//# sourceMappingURL=period.validation.js.map