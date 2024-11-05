import path from 'path';
import express, { Request, Response } from 'express';
// import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

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

app.get('/oauth', (_req: Request, res: Response) => {
  res.status(201).send('superb!');
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
