import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log(`MongoDB connected successfully. DB HOST: ${connectionInstance.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    return connectionInstance;
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default connectDB;