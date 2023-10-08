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
    categoryController.getCategories
  )
  .post(
    auth,
    validate(categoryValidation.joiCategoryPayload),
    categoryController.addCategory
  );

export default router;
