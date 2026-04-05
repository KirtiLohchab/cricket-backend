import 'dotenv/config';
import express from 'express';
import { connectDB } from './db.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Cricket Backend is running');
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

startServer();
