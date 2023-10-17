import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { historyController, historyValidation } from 'modules/history';

const router: Router = express.Router();

router
  .route('/')
  .get(auth, validate(historyValidation.params), historyController.findMany);

router.route('/:id').get(auth, historyController.findTransHistories);

export default router;
