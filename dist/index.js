const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
require('dotenv/config');
require('./types');
const body_parser_1 = __importDefault(require('body-parser'));
const configs_1 = __importDefault(require('./configs'));
const cors_1 = require('./configs/cors');
const mongodb_1 = require('./configs/mongodb');
const passport_1 = __importDefault(require('./configs/passport'));
const cors_2 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const express_mongo_sanitize_1 = __importDefault(
  require('express-mongo-sanitize')
);
const helmet_1 = __importDefault(require('helmet'));
const error_1 = require('./middlewares/error');
const passport_2 = __importDefault(require('passport'));
const v1_1 = __importDefault(require('./routes/v1'));

const app = (0, express_1.default)();
app.use(passport_2.default.initialize());
passport_1.default.google();
app.use((0, helmet_1.default)());
app.use((0, cors_2.default)(cors_1.CORS_OPTION));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_mongo_sanitize_1.default)());
app.use('/v1', v1_1.default);
app.use(error_1.errorHandler);
(0, mongodb_1.connectMongodb)();
app.listen(configs_1.default.port, function () {
  console.log(
    '\u26A1\uFE0F[server]: Server is running at http://localhost:'.concat(
      configs_1.default.port
    )
  );
});
// # sourceMappingURL=index.js.map
