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
    validate(incomeValidation.joiIncomeParams),
    incomeController.getAll
  )
  .post(
    auth,
    validate(incomeValidation.joiIncomePayload),
    incomeController.add
  );

export default router;
