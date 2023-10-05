import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { incomeController, incomeValidation } from 'modules/income';

const router: Router = express.Router();

router
  .route('/')
  .get(
    auth,
    validate(incomeValidation.incomeParams),
    incomeController.getUserIncomes
  )
  .post(
    auth,
    validate(incomeValidation.incomePayload),
    incomeController.addIncome
  );

router
  .route('/total')
  .get(
    auth,
    validate(incomeValidation.incomeParams),
    incomeController.getUserTotalIncome
  );

export default router;
