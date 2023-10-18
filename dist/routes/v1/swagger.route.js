"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_1 = __importDefault(require("configs/swagger"));
var express_1 = __importDefault(require("express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var router = express_1.default.Router();
var specs = (0, swagger_jsdoc_1.default)({
    definition: swagger_1.default,
    apis: ['src/routes/v1/*.ts']
});
router.use('/', swagger_ui_express_1.default.serve);
router.get('/', swagger_ui_express_1.default.setup(specs, {
    explorer: true
}));
exports.default = router;
//# sourceMappingURL=swagger.route.js.map