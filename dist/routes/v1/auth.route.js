"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("middlewares/validate"));
var auth_1 = require("modules/auth");
var router = express_1.default.Router();
router.route('/google').get(auth_1.authController.loginWithGoogle);
router.get('/google/callback', (0, validate_1.default)(auth_1.authValidation.social), auth_1.authController.callbackGoogle, auth_1.authController.login);
router.post('/refresh-tokens', (0, validate_1.default)(auth_1.authValidation.refreshPayload), auth_1.authController.refreshTokens);
exports.default = router;
//# sourceMappingURL=auth.route.js.map