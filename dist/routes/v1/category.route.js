"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("../../middlewares/validate"));
var auth_1 = require("../../modules/auth");
var category_1 = require("../../modules/category");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(category_1.categoryValidation.params), category_1.categoryController.findMany)
    .post(auth_1.auth, (0, validate_1.default)(category_1.categoryValidation.createPayload), category_1.categoryController.create);
router
    .route('/:id')
    .put(auth_1.auth, (0, validate_1.default)(category_1.categoryValidation.updatePayload), category_1.categoryController.update)
    .delete(auth_1.auth, category_1.categoryController.remove);
exports.default = router;
//# sourceMappingURL=category.route.js.map