import { CORS_OPTION } from 'configs/cors';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import v1Router from 'routes/v1';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// enabling the Helmet middleware
app.use(helmet());

app.use(cors(CORS_OPTION));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

app.get('/v1', (_: Request, res: Response) => {
  res.json({ ksjskjd: 'aksjlakjs' });
});

// v1 api routes
app.use('/v1', v1Router);

// Error handling middleware for CORS
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err.message === 'CORS_NOT_ALLOWED') {
    res.status(403).json({ error: 'Cross-Origin Request Blocked' });
  } else {
    next(err);
  }
});

// 404
app.get('*', function (_, res) {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
