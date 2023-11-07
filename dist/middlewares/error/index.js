"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var logger_1 = __importDefault(require("configs/logger"));
var http_status_codes_1 = require("http-status-codes");
var errorHandler = function (err, _, res, _next) {
    var statusCode = err.statusCode, message = err.message;
    logger_1.default.debug(err.statusCode);
    if (!err.isOperational) {
        statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        message = message || 'Internal Server Error';
    }
    var response = {
        code: statusCode,
        message: message
    };
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=index.js.map