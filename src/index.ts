import 'dotenv/config';
import 'types';

import bodyParser from 'body-parser';
import configs from 'configs';
import { CORS_OPTION } from 'configs/cors';
import { connectMongodb } from 'configs/mongodb';
import configPassport from 'configs/passport';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { errorHandler } from 'middlewares/error';
import passport from 'passport';
import v1Router from 'routes/v1';

const app: Express = express();

// app.use(session({ secret: 'cats' }));

// use passport
app.use(passport.initialize());

// app.use(passport.session());

// Sign in with Google

configPassport.google();

// enabling the Helmet middleware
app.use(helmet());

app.use(cors(CORS_OPTION));

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

app.get('/', (_: Request, res: Response) => {
  res.send('<a href="v1/auth/google">Auth with Google</a>');
});

// v1 api routes
app.use('/v1', v1Router);

// Error handling middleware for CORS
app.use(errorHandler);

// 404
// app.get('*', function (_, res) {
//   res.status(404).send('Not found');
// });

connectMongodb();
app.listen(configs.port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${configs.port}`
  );
});
