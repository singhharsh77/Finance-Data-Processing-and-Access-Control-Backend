import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main API routes
app.use('/api', routes);

// Root Endpoint for sanity checks
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', message: 'Welcome to the Finance Data API. Please use /api for endpoints.' });
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
