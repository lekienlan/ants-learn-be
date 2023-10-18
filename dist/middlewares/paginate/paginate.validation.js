"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiPaginate = void 0;
var joi_1 = __importDefault(require("joi"));
exports.joiPaginate = {
    sortBy: joi_1.default.string(),
    limit: joi_1.default.number().integer(),
    page: joi_1.default.number().integer(),
    pick: joi_1.default.string(),
    populate: joi_1.default.string(),
    createdAt: joi_1.default.array().items(joi_1.default.date().allow(''))
};
//# sourceMappingURL=paginate.validation.js.map