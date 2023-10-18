"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var paginate = function (schema) {
    schema.static('paginate', function (filter, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sortBy, limit, _a, page, pick, populate, skip, sort, sortingList, _b, totalResults, results, totalPages;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sortBy = options.sortBy, limit = options.limit, _a = options.page, page = _a === void 0 ? 1 : _a, pick = options.pick, populate = options.populate;
                        skip = (page - 1) * (limit || 0);
                        sort = '';
                        if (sortBy) {
                            sortingList = sortBy.split(',').map(function (sortOption) {
                                var _a = sortOption.split(':'), key = _a[0], _b = _a[1], order = _b === void 0 ? 'asc' : _b;
                                return "".concat(order === 'desc' ? '-' : '').concat(key);
                            });
                            sort = sortingList.join('');
                        }
                        else {
                            sort = '-createdAt';
                        }
                        Object.keys(filter).forEach(function (key) {
                            if (Array.isArray(filter[key])) {
                                var _a = filter[key], gte = _a[0], lte = _a[1];
                                if (gte || lte) {
                                    filter[key] = __assign(__assign({}, (gte ? { $gte: gte } : {})), (lte ? { $lte: lte } : {}));
                                }
                                else {
                                    delete filter[key];
                                }
                            }
                        });
                        return [4, Promise.all([
                                this.countDocuments(filter).exec(),
                                this.find(filter)
                                    .sort(sort)
                                    .skip(skip)
                                    .limit(limit)
                                    .select(pick === null || pick === void 0 ? void 0 : pick.replace(',', ' '))
                                    .populate(populate === null || populate === void 0 ? void 0 : populate.split(',').map(function (populateOption) { return ({
                                    path: populateOption,
                                    model: (0, lodash_1.startCase)(populateOption)
                                }); }))
                                    .exec()
                            ])];
                    case 1:
                        _b = _c.sent(), totalResults = _b[0], results = _b[1];
                        totalPages = limit ? Math.ceil(totalResults / limit) : 1;
                        return [2, {
                                results: results,
                                page: parseInt(page.toString(), 10),
                                limit: limit ? parseInt(limit.toString(), 10) : undefined,
                                totalPages: totalPages,
                                totalResults: totalResults
                            }];
                }
            });
        });
    });
};
exports.default = paginate;
//# sourceMappingURL=paginate.js.map