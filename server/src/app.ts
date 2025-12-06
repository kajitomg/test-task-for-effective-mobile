import express from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { router } from './routes';

export function App() {
  const app = express();
  
  app.use(express.json());
  app.use(cookieParser())
  
  app.use(router);
  app.use(errorMiddleware);
  
  return app;
}