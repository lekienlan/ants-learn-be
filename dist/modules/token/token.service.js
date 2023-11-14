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
exports.getAccessTokenFromRequest = exports.generateTokens = exports.verify = exports.create = exports.decode = exports.generate = void 0;
var configs_1 = __importDefault(require("configs"));
var http_status_codes_1 = require("http-status-codes");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ApiError_1 = __importDefault(require("middlewares/error/ApiError"));
var moment_1 = __importDefault(require("moment"));
var prisma_1 = __importDefault(require("prisma"));
var token_model_1 = __importDefault(require("./token.model"));
var generate = function (userId, expires, secret) {
    if (secret === void 0) { secret = configs_1.default.jwt.accessSecretKey; }
    var payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix()
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generate = generate;
var decode = function (token) {
    return jsonwebtoken_1.default.verify(token, configs_1.default.jwt.accessSecretKey);
};
exports.decode = decode;
var create = function (token, userId, expires, blacklisted) {
    if (blacklisted === void 0) { blacklisted = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var tokenDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, prisma_1.default.tokens.create({
                        data: {
                            token: token,
                            userId: userId,
                            expires: expires.toDate(),
                            blacklisted: blacklisted
                        }
                    })];
                case 1:
                    tokenDoc = _a.sent();
                    return [2, tokenDoc];
            }
        });
    });
};
exports.create = create;
var verify = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, tokenDoc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = (0, exports.decode)(token);
                if (typeof payload.sub !== 'string') {
                    throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'bad user');
                }
                return [4, token_model_1.default.findOne({
                        token: token,
                        userId: payload.sub,
                        blacklisted: false
                    })];
            case 1:
                tokenDoc = _a.sent();
                if (!tokenDoc) {
                    throw new Error('Invalid token');
                }
                return [2, tokenDoc];
        }
    });
}); };
exports.verify = verify;
var generateTokens = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var accessTokenExpires, accessToken, refreshTokenExpires, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessTokenExpires = (0, moment_1.default)().add(configs_1.default.jwt.accessExpirationMinutes, 'minutes');
                accessToken = (0, exports.generate)(user.id, accessTokenExpires);
                refreshTokenExpires = (0, moment_1.default)().add(configs_1.default.jwt.refreshExpirationDays, 'days');
                refreshToken = (0, exports.generate)(user.id, refreshTokenExpires);
                return [4, (0, exports.create)(refreshToken, user.id, refreshTokenExpires)];
            case 1:
                _a.sent();
                return [2, {
                        access: {
                            token: accessToken,
                            expires: accessTokenExpires.toDate()
                        },
                        refresh: {
                            token: refreshToken,
                            expires: refreshTokenExpires.toDate()
                        }
                    }];
        }
    });
}); };
exports.generateTokens = generateTokens;
var getAccessTokenFromRequest = function (header) {
    var _a, _b;
    var accessToken = ((_b = (_a = header.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '')) || '';
    return accessToken;
};
exports.getAccessTokenFromRequest = getAccessTokenFromRequest;
//# sourceMappingURL=token.service.js.map