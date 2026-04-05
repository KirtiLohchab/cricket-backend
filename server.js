import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Cricket Backend is running');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
