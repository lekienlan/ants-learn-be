"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("middlewares/validate"));
var auth_1 = require("modules/auth");
var pig_1 = require("modules/pig");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(pig_1.pigValidation.params), pig_1.pigController.findMany)
    .post(auth_1.auth, (0, validate_1.default)(pig_1.pigValidation.createPayload), pig_1.pigController.create);
router
    .route('/:id')
    .put(auth_1.auth, (0, validate_1.default)(pig_1.pigValidation.updatePayload), pig_1.pigController.update)
    .delete(auth_1.auth, pig_1.pigController.remove);
exports.default = router;
//# sourceMappingURL=pig.route.js.map