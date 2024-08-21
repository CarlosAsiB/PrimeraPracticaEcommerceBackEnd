import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ecommerce API',
    version: '1.0.0',
    description: 'API Documentation for Ecommerce project',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
