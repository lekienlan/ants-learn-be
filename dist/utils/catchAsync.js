"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var ApiError_1 = __importDefault(require("../middlewares/error/ApiError"));
var catchAsync = function (fn) { return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(function (err) {
        if (err.name === 'ValidationError') {
            next(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, err.message));
            return;
        }
        next(err);
    });
}; };
exports.default = catchAsync;
//# sourceMappingURL=catchAsync.js.map