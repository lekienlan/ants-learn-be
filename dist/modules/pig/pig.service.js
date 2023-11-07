"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findMany = void 0;
var http_status_codes_1 = require("http-status-codes");
var ApiError_1 = __importDefault(require("middlewares/error/ApiError"));
var paginate_1 = __importDefault(require("middlewares/paginate"));
var prisma_1 = __importDefault(require("prisma"));
var findMany = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var piggies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, paginate_1.default)(prisma_1.default.pigs, params)];
            case 1:
                piggies = _a.sent();
                return [2, piggies];
        }
    });
}); };
exports.findMany = findMany;
var create = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var pig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, prisma_1.default.pigs.create({ data: data })];
            case 1:
                pig = _a.sent();
                return [2, pig];
        }
    });
}); };
exports.create = create;
var update = function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
    var pig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, prisma_1.default.pigs.update({
                    where: { id: id },
                    data: data
                })];
            case 1:
                pig = _a.sent();
                if (!pig)
                    throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Pig not found');
                return [2, pig];
        }
    });
}); };
exports.update = update;
var remove = function (_a) {
    var id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var pig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, prisma_1.default.pigs.delete({ where: { id: id } })];
                case 1:
                    pig = _b.sent();
                    if (!pig)
                        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Pig not found');
                    return [2, pig];
            }
        });
    });
};
exports.remove = remove;
//# sourceMappingURL=pig.service.js.map