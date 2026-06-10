import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.error(
      'Failed to connect to PostgreSQL. Check api/.env and that the database is running.',
    );
    console.error(error);
    process.exit(1);
  }
};

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the other API process or set a different PORT in api/.env.`,
      );
    } else {
      console.error(error);
    }
    process.exit(1);
  });
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
