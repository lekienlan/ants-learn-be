import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { authController, authValidation } from 'modules/auth';

const router: Router = express.Router();

router.route('/google').get(authController.loginWithGoogle);

router.get(
  '/google/callback',
  validate(authValidation.joiSocial),
  authController.callbackGoogle,
  authController.login
);

router.post(
  '/refresh-tokens',
  validate(authValidation.joiRefresh),
  authController.refreshTokens
);

export default router;
