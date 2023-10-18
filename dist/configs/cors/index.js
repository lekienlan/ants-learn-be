"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_OPTION = exports.WHITE_LISTS = void 0;
var http_status_codes_1 = require("http-status-codes");
var ApiError_1 = __importDefault(require("../../middlewares/error/ApiError"));
exports.WHITE_LISTS = ['https://example.com', 'https://yourdomain.com'];
exports.CORS_OPTION = {
    origin: function (origin, callback) {
        if (exports.WHITE_LISTS.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
            return;
        }
        callback(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'CORS is not allowed'));
    }
};
//# sourceMappingURL=index.js.map