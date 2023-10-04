import type { Router } from 'express';
import express from 'express';
import { auth, authController } from 'modules/auth';

const router: Router = express.Router();

router.route('/google').get(authController.loginWithGoogle);
router
  .route('/google/callback')
  .get(authController.callbackGoogle, authController.authenticate);
router.route('/protected').get(auth, authController.loginSuccess);
router.route('/logout').get(authController.logout);

export default router;
