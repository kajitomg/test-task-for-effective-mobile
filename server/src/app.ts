import express from 'express';
import { errorMiddleware } from './middlewares/error-middleware';
import { router } from './routes';

export function App() {
  const app = express();
  
  app.use(express.json());
  
  app.use(router);
  app.use(errorMiddleware);
  
  return app;
}