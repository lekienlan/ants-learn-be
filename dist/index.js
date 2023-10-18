"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("types");
var body_parser_1 = __importDefault(require("body-parser"));
var configs_1 = __importDefault(require("configs"));
var cors_1 = require("configs/cors");
var mongodb_1 = require("configs/mongodb");
var passport_1 = __importDefault(require("configs/passport"));
var cors_2 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
var helmet_1 = __importDefault(require("helmet"));
var error_1 = require("middlewares/error");
var passport_2 = __importDefault(require("passport"));
var v1_1 = __importDefault(require("routes/v1"));
var app = (0, express_1.default)();
app.use(passport_2.default.initialize());
passport_1.default.google();
app.use((0, helmet_1.default)());
app.use((0, cors_2.default)(cors_1.CORS_OPTION));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_mongo_sanitize_1.default)());
app.use('/v1', v1_1.default);
app.use(error_1.errorHandler);
(0, mongodb_1.connectMongodb)();
app.listen(configs_1.default.port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(configs_1.default.port));
});
//# sourceMappingURL=index.js.map