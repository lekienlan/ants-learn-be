import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { periodController, periodValidation } from 'modules/period';

const router: Router = express.Router();

router
  .route('/')
  .get(auth, validate(periodValidation.params), periodController.findMany)
  .post(
    auth,
    validate(periodValidation.createPayload),
    periodController.create
  );

router
  .route('/:id')
  .put(auth, validate(periodValidation.updatePayload), periodController.update)
  .delete(auth, periodController.remove);

export default router;
