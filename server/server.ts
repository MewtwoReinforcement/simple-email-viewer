import express, { Request, Response } from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/oauth', (_req: Request, res: Response) => {
  res.status(201).send('superb!');
});

app.listen(3000, () => {
  console.log('Server listening at port 3000...');
});
