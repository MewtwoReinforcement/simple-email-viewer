import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import googleController from './controllers/googleController.ts';
import cookieParser from 'cookie-parser';

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log('DB connected', /*result*/);
  })
  .catch((err) => {
    console.log('Failed', err);
  });

const app = express();
const port = Number(process.env.port) || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.resolve(import.meta.dirname, '../client/assets')));

app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/login', googleController.initiateOAuth);

app.get('/oauth', googleController.saveOAuthDetails, (req, res) => {
  res.send('OAuth flow completed! You can now access Gmail data.');
});

app.get('/users/:id/messages', googleController.getMessages, (req, res) => {
  return res.status(200).json(res.locals.messages);
});

app.get('/users/:id/contacts', googleController.getContacts, (req, res) => {
  return res.status(200).json(res.locals.contacts);
});

app.post('/users/:id/contacts', googleController.addContacts, (req, res) => {
  return res.status(200).json(res.locals.contacts);
});

app.delete('/users/:id/contacts', googleController.addContacts, (req, res) => {
  return res.status(200).json(res.locals.contacts);
});

app.use((req, res, _next) => {
  return res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.originalUrl} does not exist`,
  });
});

app.get((err, _req, res, _next) => {
  res.status(201).send('superb!');
  if (err.response) {
    console.error('Response from external API:', err.response.data);
  }

  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: err.details || 'An unexpected error occurred.',
  });
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
