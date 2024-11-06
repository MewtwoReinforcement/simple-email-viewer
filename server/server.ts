import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import googleController from '../server/controllers/googleController';
import cookieParser from 'cookie-parser';

const app = express();
const port: number = Number(process.env.port) || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/assets')));

app.get('/', (req: Request, res: Response): void => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

// app.get('/users', (req: Request, res: Response): void => {
//   return res
//     .status(200)
//     .sendFile(path.resolve(__dirname, '../client/index.html'));
// });

// app.post('/users', (req: Request, res: Response): void => {
//   return res
//     .status(200)
//     .sendFile(path.resolve(__dirname, '../client/index.html'));
// });
// app.post('/users', (req: Request, res: Response): void => {
//   return res
//     .status(200)
//     .sendFile(path.resolve(__dirname, '../client/index.html'));
// });

app.get('/login', googleController.initiateOAuth);

app.get(
  '/oauth',
  googleController.saveOAuthDetails,
  (req: Request, res: Response) => {
    res.send('OAuth flow completed! You can now access Gmail data.');
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.originalUrl} does not exist`,
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err);

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
