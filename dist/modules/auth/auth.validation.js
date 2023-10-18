"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshPayload = exports.social = void 0;
var joi_1 = __importDefault(require("joi"));
exports.social = {
    user: joi_1.default.object().keys({
        email: joi_1.default.string().required()
    })
};
exports.refreshPayload = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required()
    })
};
//# sourceMappingURL=auth.validation.js.map