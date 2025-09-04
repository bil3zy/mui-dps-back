import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';

import mongoose from 'mongoose';
import personRoutes from './routes/person.routes.ts';
import caseRoutes from './routes/case.routes.ts';
// import personRoutes from './routes/person.routes.ts';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware to parse JSON bodies
app.use(express.json());

// Type check for MONGODB_URI
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure code
  });

// Basic route with type annotations
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to mui-dps backend (TypeScript edition)!');
});

app.use('/api/persons', personRoutes);
app.use('/api/cases', caseRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});