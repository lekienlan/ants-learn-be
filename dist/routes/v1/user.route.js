"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("middlewares/validate"));
var auth_1 = require("modules/auth");
var user_1 = require("modules/user");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(user_1.userValidation.params), user_1.userController.getAll);
exports.default = router;
//# sourceMappingURL=user.route.js.map