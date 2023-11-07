"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid('production', 'staging')
        .required()
        .default('staging'),
    PORT: joi_1.default.number().default(3000),
    MONGODB_URL: joi_1.default.string().required().description('Mongo DB url'),
    ACCESS_TOKEN_SECRET_KEY: joi_1.default.string()
        .required()
        .description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number()
        .default(300)
        .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description('minutes after which reset password token expires'),
    GOOGLE_CLIENT_ID: joi_1.default.string().required().description('Google client id'),
    GOOGLE_CLIENT_SECRET: joi_1.default.string()
        .required()
        .description('Google client id')
})
    .unknown();
var _a = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env), envVars = _a.value, error = _a.error;
if (error) {
    throw new Error("Config validation error: ".concat(error.message));
}
var configs = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        accessSecretKey: envVars.ACCESS_TOKEN_SECRET_KEY,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET
    }
};
exports.default = configs;
//# sourceMappingURL=index.js.map