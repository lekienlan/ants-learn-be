"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("middlewares/validate"));
var auth_1 = require("modules/auth");
var period_1 = require("modules/period");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(period_1.periodValidation.params), period_1.periodController.findMany)
    .post(auth_1.auth, (0, validate_1.default)(period_1.periodValidation.createPayload), period_1.periodController.create);
router
    .route('/:id')
    .get(auth_1.auth, period_1.periodController.findOne)
    .put(auth_1.auth, (0, validate_1.default)(period_1.periodValidation.updatePayload), period_1.periodController.update)
    .delete(auth_1.auth, period_1.periodController.remove);
exports.default = router;
//# sourceMappingURL=period.route.js.map