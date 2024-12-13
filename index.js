import { initializeAWSIoT } from './lib.js';
import connectDB from './db/index.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting AWS IoT Core logger...');

// Connect to MongoDB first, then initialize AWS IoT
connectDB()
    .then(() => {
        console.log('MongoDB connected, initializing AWS IoT...');
        initializeAWSIoT();
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });
