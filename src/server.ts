import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes';  

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

app.use('/jobs', jobRoutes);  

const startServer = async () => {
  const { MONGO_URI, PORT } = process.env

  if(!MONGO_URI) throw new Error('MONGO_URI is required')
  if(!PORT) throw new Error('Port is required')  

  try {
    await mongoose.connect(MONGO_URI || "");
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT || 3000}`);
    });
  } catch (error) {
    throw new Error(`MongoDB Connection Error: ${(error as Error).message}`)
  }
};

startServer();

