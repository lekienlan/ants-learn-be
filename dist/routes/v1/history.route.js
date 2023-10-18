"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validate_1 = __importDefault(require("middlewares/validate"));
var auth_1 = require("modules/auth");
var history_1 = require("modules/history");
var router = express_1.default.Router();
router
    .route('/')
    .get(auth_1.auth, (0, validate_1.default)(history_1.historyValidation.params), history_1.historyController.findMany);
router.route('/:id').get(auth_1.auth, history_1.historyController.findTransHistories);
exports.default = router;
//# sourceMappingURL=history.route.js.map