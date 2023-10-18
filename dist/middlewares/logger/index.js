"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var winston_1 = __importStar(require("winston"));
var logFormat = winston_1.format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, " [").concat(info.label, "]: ").concat(info.message); });
var filePath = "".concat(path_1.default.dirname(__filename), "/").concat(path_1.default.basename(__filename));
var logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.label({
        label: (_a = filePath.match(/\/src\/(.*)/)) === null || _a === void 0 ? void 0 : _a[1]
    }), winston_1.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), winston_1.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), logFormat)
        }),
        new winston_1.transports.File({
            filename: 'logs/combined.log',
            format: winston_1.format.combine(winston_1.format.json())
        })
    ],
    exitOnError: false
});
exports.default = logger;
//# sourceMappingURL=index.js.map