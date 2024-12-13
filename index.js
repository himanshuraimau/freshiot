import app from './app.js';
import connectDB from './db/index.js';
import { initializeAWSIoT } from './lib.js';

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Initialize AWS IoT Core connection
  initializeAWSIoT();
})
.catch((err) => {
  console.error("MongoDB connection failed:", err);
});
