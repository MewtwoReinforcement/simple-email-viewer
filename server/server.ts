import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port: number = Number(process.env.port) || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/assets')));

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

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
