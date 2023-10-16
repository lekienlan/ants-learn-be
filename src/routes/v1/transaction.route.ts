import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import {
  transactionController,
  transactionValidation
} from 'modules/transaction';

const router: Router = express.Router();

router
  .route('/')
  .get(
    auth,
    validate(transactionValidation.params),
    transactionController.findMany
  )
  .post(
    auth,
    validate(transactionValidation.createPayload),
    transactionController.create
  );

router
  .route('/:id')
  .get(auth, transactionController.findOne)
  .put(
    auth,
    validate(transactionValidation.updatePayload),
    transactionController.update
  )
  .delete(auth, transactionController.remove);

export default router;
