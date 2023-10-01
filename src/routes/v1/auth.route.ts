import type { Router } from 'express';
import express from 'express';
import { authController } from 'modules/auth';

const router: Router = express.Router();

router.route('/google').get(authController.loginWithGoogle);

export default router;
