import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected successfully. DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default connectDB;