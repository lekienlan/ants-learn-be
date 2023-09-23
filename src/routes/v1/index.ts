import type { Router } from 'express';
import express from 'express';

import docsRoute from './swagger.route';
import userRoute from './user.route';
// import userRoute from './user.route';

const v1Router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/users',
    route: userRoute
  }
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultIRoute.forEach((route) => {
  v1Router.use(route.path, route.route);
});

/* istanbul ignore next */

if (process.env.NODE_ENV === 'staging') {
  devIRoute.forEach((route) => {
    v1Router.use(route.path, route.route);
  });
}

export default v1Router;
