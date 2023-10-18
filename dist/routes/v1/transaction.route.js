"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("../../middlewares/validate"));
var auth_1 = require("../../modules/auth");
var transaction_1 = require("../../modules/transaction");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(transaction_1.transactionValidation.params), transaction_1.transactionController.findMany)
    .post(auth_1.auth, (0, validate_1.default)(transaction_1.transactionValidation.createPayload), transaction_1.transactionController.create);
router
    .route('/:id')
    .get(auth_1.auth, transaction_1.transactionController.findOne)
    .put(auth_1.auth, (0, validate_1.default)(transaction_1.transactionValidation.updatePayload), transaction_1.transactionController.update)
    .delete(auth_1.auth, transaction_1.transactionController.remove);
exports.default = router;
//# sourceMappingURL=transaction.route.js.map