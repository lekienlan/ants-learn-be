"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("app"));
var configs_1 = __importDefault(require("configs"));
var logger_1 = __importDefault(require("configs/logger"));
var mongodb_1 = require("configs/mongodb");
(0, mongodb_1.connectMongodb)();
app_1.default.listen(configs_1.default.port, function () {
    logger_1.default.info("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(configs_1.default.port));
});
//# sourceMappingURL=index.js.map