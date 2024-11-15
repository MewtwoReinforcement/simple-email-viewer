import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import googleController from './controllers/googleController.ts';
import authController from './controllers/authController.ts';
import fetchForDatabase from './fetchForDatabase.ts';
import cookieController from './controllers/cookieController.ts';

mongoose
  .connect(process.env.MONGO_URI ?? 'could not load uri')
  .then(() => {
    console.log('DB connected');
    setInterval(fetchForDatabase, 60000);
  })
  .catch(err => {
    console.log('DB Connection Failed: ', err);
  });

const app = express();
const port = Number(process.env.port) || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.resolve(import.meta.dirname, '../client/assets')));

app.get('/', (_req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(import.meta.dirname, '../client/index.html'));
});

app.get(
  '/api/login',
  cookieController.generateSessionId,
  authController.initiateOAuth,
  (_req, res) => {
    return res.redirect(res.locals.oauthRedirectUrl);
  },
);

app.get(
  '/oauth',
  authController.saveOAuthDetails,
  cookieController.setGoogleId,
  (_req, res) => {
    return res.redirect('/');
  },
);

app.get(
  '/api/users/:id/messages',
  googleController.getMessages,
  (_req, res) => {
    res.status(200).json(res.locals.messages);
  },
);

app.get(
  '/api/users/:id/contacts',
  googleController.getContacts,
  (_req, res) => {
    res.status(200).json(res.locals.contacts);
  },
);

app.use((req, res, _next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.originalUrl} does not exist`,
  });
});

app.use(
  '*',
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const DEFAULT_ERROR = {
      log: 'An Unknown Middleware Error Occurred',
      status: 500,
      message: {
        err: 'A Server Error Occured',
      },
    };
    const specificError = { ...DEFAULT_ERROR, ...err };
    console.error(specificError.log);
    res.status(specificError.status).json(specificError.message);
  },
);

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
