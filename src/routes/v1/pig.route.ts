import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { pigController, pigValidation } from 'modules/pig';

const router: Router = express.Router();

router
  .route('/')
  .get(auth, validate(pigValidation.params), pigController.findMany)
  .post(auth, validate(pigValidation.createPayload), pigController.create);

router
  .route('/:id')
  .get(auth, pigController.findFirst)
  .put(auth, validate(pigValidation.updatePayload), pigController.update)
  .delete(auth, pigController.remove);

export default router;
