import express from 'express';
import { connect } from './db';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
// Routers
import userRouter from './routes/user.router';

dotenv.config(); // Load .env file into process.env

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
// Parse request body as JSON
app.use(json());

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StockTracker API',
      version: '1.0.0',
      description: 'Rest API docs for StockTracker'
    }
  },
  apis: ['src/**/*.ts']
};
const swaggerSpec = swaggerJSDoc(options);

// Load Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes here
app.use('/api/v1/users', userRouter);

connect()
  .then(() => {
    app.listen(process.env.PORT ?? 3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((error) => {
    console.log('Error connecting to database:', error);
  });
