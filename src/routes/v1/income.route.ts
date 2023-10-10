import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { incomeController, incomeValidation } from 'modules/income';

const router: Router = express.Router();

router
  .route('/')
  .get(auth, validate(incomeValidation.params), incomeController.findMany)
  .post(
    auth,
    validate(incomeValidation.createPayload),
    incomeController.create
  );

router
  .route('/:id')
  .get(auth, incomeController.findOne)
  .put(auth, validate(incomeValidation.updatePayload), incomeController.update)
  .delete(auth, incomeController.remove);

export default router;
