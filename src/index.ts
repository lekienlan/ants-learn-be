import { CORS_OPTION } from 'configs/cors';
import { connectMongodb } from 'configs/mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { errorHandler } from 'middlewares/error';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import v1Router from 'routes/v1';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/google/callback'
    },
    function (_accessToken, _refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

const app: Express = express();
const port = process.env.PORT;

// enabling the Helmet middleware
app.use(helmet());

app.use(passport.initialize());

app.use(cors(CORS_OPTION));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

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
app.get('*', function (_, res) {
  res.status(404).send('Not found');
});

connectMongodb();
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
