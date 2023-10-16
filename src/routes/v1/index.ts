import configs from 'configs';
import type { Router } from 'express';
import express from 'express';

import authRoute from './auth.route';
import categoryRoute from './category.route';
import periodRoute from './period.route';
import pigRoute from './pig.route';
import docsRoute from './swagger.route';
import transactionRoute from './transaction.route';
import userRoute from './user.route';

const v1Router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/transactions',
    route: transactionRoute
  },
  {
    path: '/categories',
    route: categoryRoute
  },
  {
    path: '/piggies',
    route: pigRoute
  },
  {
    path: '/periods',
    route: periodRoute
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

if (configs.env === 'staging') {
  devIRoute.forEach((route) => {
    v1Router.use(route.path, route.route);
  });
}

export default v1Router;
