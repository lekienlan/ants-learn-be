import type { Router } from 'express';
import express from 'express';
import validate from 'middlewares/validate';
import { auth } from 'modules/auth';
import { categoryController, categoryValidation } from 'modules/category';

const router: Router = express.Router();

router
  .route('/')
  .get(
    auth,
    validate(categoryValidation.joiCategoryParams),
    categoryController.getAll
  )
  .post(
    auth,
    validate(categoryValidation.joiCategoryPayload),
    categoryController.add
  );

export default router;
