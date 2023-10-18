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
var paginate_1 = __importDefault(require("middlewares/paginate"));
var mongoose_1 = __importStar(require("mongoose"));
var utils_1 = require("utils");
var periodSchema = new mongoose_1.Schema({
    startDate: Date,
    endDate: Date,
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Member' }],
    budget: {
        type: Number,
        required: true
    },
    repeat: Boolean,
    status: String,
    pigId: mongoose_1.default.Schema.Types.ObjectId
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
periodSchema.plugin(paginate_1.default);
periodSchema.virtual('expenses', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'periodId'
});
var Period = mongoose_1.default.model('Period', periodSchema);
exports.default = Period;
//# sourceMappingURL=period.model.js.map