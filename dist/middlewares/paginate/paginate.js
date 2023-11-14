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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateFilter = void 0;
var lodash_1 = require("lodash");
var utils_1 = require("utils");
var paginateFilter = function (filter) {
    var formattedFilter = (0, lodash_1.omit)(filter, ['limit', 'sortBy', 'page']);
    Object.keys(formattedFilter).forEach(function (key) {
        if (Array.isArray(formattedFilter[key])) {
            var _a = formattedFilter[key], gte = _a[0], lte = _a[1];
            if (gte || lte) {
                formattedFilter[key] = __assign(__assign({}, (gte ? { gte: (0, utils_1.convertStringToType)(gte) } : {})), (lte ? { lte: (0, utils_1.convertStringToType)(lte) } : {}));
            }
            else {
                delete formattedFilter[key];
            }
        }
        else {
            formattedFilter[key] = { in: formattedFilter[key].split(',') };
        }
    });
    return formattedFilter;
};
exports.paginateFilter = paginateFilter;
var paginate = function (model, params, include) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sortBy, limit, page, query, _limit, _page, skip, orderBy, totalResults, results, totalPages;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = params.sortBy, sortBy = _a === void 0 ? 'updatedAt' : _a, limit = params.limit, page = params.page, query = __rest(params, ["sortBy", "limit", "page"]);
                _limit = limit ? parseInt(limit, 10) : 10;
                _page = page ? parseInt(page, 10) : 1;
                skip = (_page - 1) * (_limit || 0);
                orderBy = sortBy.startsWith('-')
                    ? { field: sortBy.substring(1), direction: 'desc' }
                    : { field: sortBy, direction: 'asc' };
                return [4, model.count({ where: (0, exports.paginateFilter)(query) })];
            case 1:
                totalResults = _c.sent();
                return [4, model.findMany({
                        where: (0, exports.paginateFilter)(query),
                        skip: skip,
                        take: _limit,
                        orderBy: (_b = {},
                            _b[orderBy.field] = orderBy.direction,
                            _b),
                        include: include
                    })];
            case 2:
                results = _c.sent();
                totalPages = _limit ? Math.ceil(totalResults / _limit) : 1;
                return [2, {
                        results: results,
                        page: _page,
                        limit: _limit,
                        totalPages: totalPages,
                        totalResults: totalResults
                    }];
        }
    });
}); };
exports.default = paginate;
//# sourceMappingURL=paginate.js.map