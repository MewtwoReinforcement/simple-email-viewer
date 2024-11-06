import path from 'path';
import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.port) || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/users', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.post('/users', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/oauth', (_req, res) => {
  res.status(201).send('superb!');
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
