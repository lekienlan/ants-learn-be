"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var paginate_1 = __importDefault(require("../../middlewares/paginate"));
var mongoose_1 = __importStar(require("mongoose"));
var utils_1 = require("../../utils");
var historySchema = new mongoose_1.Schema({
    transactionId: String,
    data: {
        amount: Number,
        userId: String,
        categoryId: String,
        date: Date,
        note: String,
        currency: String,
        periodId: String
    },
    state: String
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (_, ret) {
            ret === null || ret === void 0 ? true : delete ret._id;
            return (0, utils_1.sortWithIdOnTop)(ret);
        }
    }
});
historySchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});
historySchema.plugin(paginate_1.default);
var History = mongoose_1.default.model('History', historySchema);
exports.default = History;
//# sourceMappingURL=history.model.js.map