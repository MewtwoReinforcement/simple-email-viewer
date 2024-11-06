import path from 'path';
import express, { Request, Response } from 'express';
// import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import googleController from './controllers/googleController';

mongoose
  .connect(process.env.MONGO_URI as string)
  .then((result): void => {
    console.log('DB connected', result);
  })
  .catch((err: string) => {
    console.log('Failed', err);
  });

const app = express();
const port: number = Number(process.env.port) || 3000;

app.use(express.json());
app.use(express.urlencoded());
// app.use(cors());

app.get('/', (req: Request, res: Response): void => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/users', (req: Request, res: Response): void => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.post('/users', (req: Request, res: Response): void => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get(
  '/users/:id/messages',
  googleController.getMessages,
  (req: Request, res: Response): void => {
    return res.status(200).json(res.locals.messages);
  }
);

app.get(
  '/users/:id/contacts',
  googleController.getContacts,
  (req: Request, res: Response): void => {
    return res.status(200).json(res.locals.contacts);
  }
);

app.post(
  '/users/:id/contacts',
  googleController.addContacts,
  (req: Request, res: Response): void => {
    return res.status(200).json(res.locals.contacts);
  }
);

app.delete(
  '/users/:id/contacts',
  googleController.addContacts,
  (req: Request, res: Response): void => {
    return res.status(200).json(res.locals.contacts);
  }
);

app.get('/oauth', (_req: Request, res: Response) => {
  res.status(201).send('superb!');
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
