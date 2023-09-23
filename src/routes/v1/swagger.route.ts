import SWAGGER_DEFINITION from 'configs/swagger';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

const specs = swaggerJsdoc({
  definition: SWAGGER_DEFINITION,
  apis: ['./index.ts']
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true
  })
);

export default router;
