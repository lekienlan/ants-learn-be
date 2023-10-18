"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var configs_1 = __importDefault(require("configs"));
var express_1 = __importDefault(require("express"));
var auth_route_1 = __importDefault(require("./auth.route"));
var category_route_1 = __importDefault(require("./category.route"));
var history_route_1 = __importDefault(require("./history.route"));
var period_route_1 = __importDefault(require("./period.route"));
var pig_route_1 = __importDefault(require("./pig.route"));
var swagger_route_1 = __importDefault(require("./swagger.route"));
var transaction_route_1 = __importDefault(require("./transaction.route"));
var user_route_1 = __importDefault(require("./user.route"));
var v1Router = express_1.default.Router();
var defaultIRoute = [
    {
        path: '/auth',
        route: auth_route_1.default
    },
    {
        path: '/users',
        route: user_route_1.default
    },
    {
        path: '/transactions',
        route: transaction_route_1.default
    },
    {
        path: '/categories',
        route: category_route_1.default
    },
    {
        path: '/piggies',
        route: pig_route_1.default
    },
    {
        path: '/periods',
        route: period_route_1.default
    },
    {
        path: '/histories',
        route: history_route_1.default
    }
];
var devIRoute = [
    {
        path: '/docs',
        route: swagger_route_1.default
    }
];
defaultIRoute.forEach(function (route) {
    v1Router.use(route.path, route.route);
});
if (configs_1.default.env === 'staging') {
    devIRoute.forEach(function (route) {
        v1Router.use(route.path, route.route);
    });
}
exports.default = v1Router;
//# sourceMappingURL=index.js.map