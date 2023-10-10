import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { categoryController, categoryValidation } from 'modules/category';

const router: Router = express.Router();

router
  .route('/')
  .get(auth, validate(categoryValidation.params), categoryController.findMany)
  .post(
    auth,
    validate(categoryValidation.createPayload),
    categoryController.create
  );

router
  .route('/:id')
  .put(
    auth,
    validate(categoryValidation.updatePayload),
    categoryController.update
  )
  .delete(auth, categoryController.remove);

export default router;
